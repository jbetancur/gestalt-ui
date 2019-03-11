import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import axios from 'axios';
import SelectField from 'components/Fields/SelectField';
import Log from 'components/Log';
import { ActivityContainer } from 'components/ProgressIndicators';
import { IconButton, FlatButton, FileDownloadButton } from 'components/Buttons';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Title } from 'components/Typography';
import { API_TIMEOUT } from '../../constants';
import { timeSpans } from './constants';
import actions from './actions';

const PageWrapper = styled.div`
  height: 100%;
  position: relative;
`;

const Toolbar = styled.header`
  display: flex;
  align-items: center;
  min-height: 52px;
  width: 100%;
  position: ${props => (props.fullPage ? 'fixed' : 'relative')};
  background-color: white;
  padding-left: 16px;
  padding-right: 16px;
  ${props => props.fullPage && css`
    z-index: 1;
  `};

  button {
    margin-left: 5px;
  }
`;

const TitleSection = styled.div`
  flex: 1 1 auto;
`;

const ToolbarControls = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const ScrollButtons = styled.div`
  position: fixed;
  z-index: 9999;
  top: 46%;
  right: 1em;
  padding: 3px;
  background: rgb(33, 150, 243, 0.14);
  border-radius: 5px;
`;

const TopScrollButton = styled(IconButton)`
  ${props => props.fullPage && 'color: white'};
  display: block !important;
`;

const BottomScrollButton = styled(IconButton)`
  ${props => props.fullPage && 'color: white'};
  display: block;
`;

const OutputButtons = styled.div`
  padding: 5px 5px 5px 5px;

  button {
    margin-left: 5px;
  }
`;

const TimeSpanSelect = styled(SelectField)`
  height: 38px;
`;

class Logging extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    fqon: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    providerType: PropTypes.string,
    logId: PropTypes.string.isRequired,
    logType: PropTypes.oneOf(['container', 'lambda']).isRequired,
    fetchLogProvider: PropTypes.func.isRequired,
    unloadLogProvider: PropTypes.func.isRequired,
    logProviderURL: PropTypes.string.isRequired,
    logProviderPending: PropTypes.bool.isRequired,
    fullPage: PropTypes.bool,
    showTitle: PropTypes.bool,
  };

  static defaultProps = {
    providerType: null,
    fullPage: false,
    showTitle: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      logPending: false,
      logTimespan: '5m',
      stderr: false,
      logProviderURL: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.logProviderURL !== prevState.logProviderURL) {
      if (nextProps.logProviderURL) {
        return {
          logProviderURL: nextProps.logProviderURL,
        };
      }
    }

    return null;
  }

  componentDidMount() {
    const { fetchLogProvider, fqon, logType, providerId, logProviderURL } = this.props;
    if (!logProviderURL) {
      fetchLogProvider(fqon, providerId, logType);
    }

    if (logProviderURL) {
      this.fetchLogs(this.props, this.state);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.logProviderURL !== this.state.logProviderURL && this.state.logProviderURL) {
      this.fetchLogs(this.props, this.state);
    }

    if (prevState.logTimespan !== this.state.logTimespan) {
      this.fetchLogs(this.props, this.state);
    }

    if (prevState.stderr !== this.state.stderr) {
      this.fetchLogs(this.props, this.state);
    }
  }

  componentWillUnmount() {
    this.props.unloadLogProvider();
  }

  setLogTimespan = ({ target }) => this.setState({ logTimespan: target.value });

  showStdErr = stderr => this.setState({ stderr });

  scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  fetchLogs(currentProps, currentState) {
    const { logId } = this.props;
    const logAPI = axios.create({
      baseURL: currentProps.logProviderURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    this.setState({ logPending: true });

    const time = (currentState.logTimespan && currentState.logTimespan !== 'all') ? `?time=${currentState.logTimespan}&stderr=${currentState.stderr}` : `?stderr=${currentState.stderr}`;

    logAPI.get(`${logId}${time}`).then((response) => {
      this.setState({ logPending: false });

      if (response.data && response.data.length && response.data[0]) {
        this.setState({ logs: response.data });
        this.scrollToBottom();
      } else {
        this.setState({ logs: [`${this.props.name} has not logged any messages yet...`] });
      }
    }).catch((error) => {
      const errorCode = `code: ${get(error, 'response.status') || ''}`;
      const errorStatus = `message: ${get(error, 'response.statusText') || ''}`;

      this.setState({ logPending: false, logs: ['unable to contact the log api', `${error} ${errorCode} ${errorStatus}`] });
    });
  }

  render() {
    const { logProviderPending, logProviderURL, logType, providerType, name, fullPage, showTitle } = this.props;
    const { logs, logPending, logTimespan } = this.state;
    const showLogOutputs = logType === 'container' && providerType === 'DCOS';
    const disableControls = logProviderPending || logPending || !logProviderURL;

    return (
      <PageWrapper>
        <Toolbar fullPage={fullPage}>
          <TitleSection>
            {showTitle && <Title small>Logs for {name} ({logType})</Title>}
          </TitleSection>
          <ToolbarControls>
            {showLogOutputs &&
              <OutputButtons>
                <FlatButton
                  variant={!this.state.stderr ? 'contained' : 'text'}
                  color={!this.state.stderr ? 'primary' : 'default'}
                  onClick={() => this.showStdErr(false)}
                  disabled={disableControls}
                  label="STDOUT"
                />
                <FlatButton
                  variant={this.state.stderr ? 'contained' : 'text'}
                  color={this.state.stderr ? 'primary' : 'default'}
                  onClick={() => this.showStdErr(true)}
                  disabled={disableControls}
                  label="STDERR"
                />
              </OutputButtons>}
            <TimeSpanSelect
              id="log--timespan"
              menuItems={timeSpans}
              itemLabel="name"
              itemValue="value"
              value={logTimespan}
              onChange={this.setLogTimespan}
              disabled={disableControls}
            />
            <IconButton
              icon={<RefreshIcon fontSize="small" />}
              tooltipLabel="Refresh Log"
              onClick={() => this.fetchLogs(this.props, this.state)}
              disabled={disableControls}
            />
            <FileDownloadButton
              data={(logs.length > 0 && logs.join('\n')) || ''}
              tooltipLabel="Download Log"
              fileName={`${name}-${logType}.log`}
              disabled={disableControls}
            />
            {fullPage &&
              <IconButton
                icon={<CloseIcon fontSize="small" />}
                tooltipLabel="Close"
                onClick={() => window.close()}
              />}
          </ToolbarControls>
        </Toolbar>

        {(logProviderPending || logPending) &&
          <ActivityContainer id="log-loading" primary centered size={2} />}

        {fullPage &&
          <ScrollButtons>
            <TopScrollButton
              icon={<ArrowUpwardIcon fontSize="small" />}
              color="primary"
              tooltipLabel="Scroll to Top"
              tooltipPosition="left"
              onClick={this.scrollToTop}
              fullPage={fullPage}
            />
            <BottomScrollButton
              icon={<ArrowDownwardIcon fontSize="small" />}
              color="primary"
              tooltipLabel="Scroll to Bottom"
              tooltipPosition="left"
              onClick={this.scrollToBottom}
              fullPage={fullPage}
            />
          </ScrollButtons>}

        <Log fullPage={fullPage} logItems={this.state.logs} />
      </PageWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  const { logging } = state;

  return {
    logProviderPending: logging.logProvider.pending,
    logProviderURL: logging.logProvider.logProvider.url,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, actions),
)(Logging);
