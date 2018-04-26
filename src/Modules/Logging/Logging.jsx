import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-flexybox';
import styled, { css } from 'styled-components';
import { withMetaResource } from 'Modules/MetaResource';
import axios from 'axios';
import { SelectField } from 'react-md';
import Div from 'components/Div';
import { DotActivity } from 'components/ProgressIndicators';
import { Button, FileDownloadButton } from 'components/Buttons';
import { Title } from 'components/Typography';
import { API_TIMEOUT } from '../../constants';
import Log from './components/Log';
import { timeSpans } from './constants';


const PageWrapper = styled.div`
  height: 100%;
  position: relative;
`;

const Toolbar = styled.header`
  display: flex;
  align-items: center;
  min-height: 3.5em;
  width: 100%;
  position: ${props => (props.fullPage ? 'fixed' : 'relative')};
  background-color: white;
  padding-left: 16px;

  ${props => props.fullPage && css`
    z-index: 1;
  `};
`;

const ToolbarActions = styled.div`
  text-align: right;
`;

const ToolbarControls = styled.div`
  text-align: left;
  display: inline-block;
  vertical-align: top;
`;

const LogOutputWrapper = styled.div`
  display: inline-block;
  padding-left: 16px;
`;

const LogOutputButton = styled(Button)`
  color: white;
`;

const ScrollButtons = styled.div`
  position: fixed;
  z-index: 9999;
  top: 46%;
  height: 100px;
  right: 1em;
`;

const TopScrollButton = styled(Button)`
  ${props => props.fullPage && 'color: white'};
  display: block;
`;

const BottomScrollButton = styled(Button)`
  ${props => props.fullPage && 'color: white'};
  display: block;
`;

const Activity = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
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
  };

  static defaultProps = {
    providerType: null,
    fullPage: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.logProviderURL !== prevState.logProviderURL) {
      if (nextProps.logProviderURL) {
        return {
          logProviderURL: nextProps.logProviderURL,
          logs: [`${nextProps.name} ${nextProps.logType} has not logged any messages yet...`],
        };
      }
    }

    return null;
  }

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

  componentDidMount() {
    const { fetchLogProvider, fqon, logType, providerId } = this.props;
    if (!this.props.logProviderURL) {
      fetchLogProvider(fqon, providerId, logType);
    }
  }

  componentDidUpdate(prevProps, prevState) {
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

  setLogTimespan = value => this.setState({ logTimespan: value });

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

      if (response.data && response.data.length) {
        this.setState({ logs: response.data });
        this.scrollToBottom();
      }
    }).catch((error) => {
      this.setState({ logPending: false, logs: ['unable to contact the log api', `${error}`] });
    });
  }

  render() {
    const { logProviderPending, logProviderURL, logType, providerType, name, fullPage } = this.props;
    const { logs, logPending, logTimespan } = this.state;
    const showLogOutputs = logType === 'container' && providerType === 'DCOS';

    return (
      <PageWrapper>
        <Toolbar fullPage={fullPage}>
          <Row gutter={5} alignItems="center">
            <Col xs={12} sm={4} md={6} lg={8}>
              <Title small>Logs for {name} ({logType})</Title>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <ToolbarActions>
                <ToolbarControls>
                  <SelectField
                    id="log--timespan"
                    menuItems={timeSpans}
                    itemLabel="name"
                    itemValue="value"
                    defaultValue={logTimespan}
                    lineDirection="center"
                    position="below"
                    onChange={this.setLogTimespan}
                  />
                </ToolbarControls>
                <Button
                  icon
                  iconChildren="refresh"
                  tooltipLabel="Refresh Log"
                  onClick={() => this.fetchLogs(this.props, this.state)}
                  disabled={logProviderPending || logPending || !logProviderURL}
                />
                <FileDownloadButton
                  icon
                  data={logs.length && logs.join('\n')}
                  tooltipLabel="Download Log"
                  fileName={`${name}-${logType}.log`}
                  disabled={logProviderPending || logPending || !logProviderURL}
                />
                {fullPage &&
                  <Button
                    icon
                    iconChildren="close"
                    tooltipLabel="Close"
                    onClick={() => window.close()}
                  />}
              </ToolbarActions>
            </Col>
          </Row>
        </Toolbar>

        {fullPage &&
          <ScrollButtons>
            <TopScrollButton
              icon
              iconChildren="arrow_upward"
              primary
              tooltipLabel="Scroll to Top"
              tooltipPosition="left"
              onClick={this.scrollToTop}
              fullPage={fullPage}
            />
            <BottomScrollButton
              icon
              iconChildren="arrow_downward"
              primary
              tooltipLabel="Scroll to Bottom"
              tooltipPosition="left"
              onClick={this.scrollToBottom}
              fullPage={fullPage}
            />
          </ScrollButtons>}

        <Log fullPage={fullPage} logItems={this.state.logs}>
          {(logProviderPending || logPending) &&
            <Activity>
              <DotActivity id="log-loading" primary centered size={2} />
            </Activity>}
          <Div disabled={logProviderPending || logPending}>
            {showLogOutputs &&
              <LogOutputWrapper>
                <LogOutputButton
                  raised
                  primary={!this.state.stderr}
                  onClick={() => this.showStdErr(false)}
                >
                  STDOUT
                </LogOutputButton>
                <LogOutputButton
                  raised
                  primary={this.state.stderr}
                  onClick={() => this.showStdErr(true)}
                >
                  STDERR
                </LogOutputButton>
              </LogOutputWrapper>}
          </Div>
        </Log>
      </PageWrapper>
    );
  }
}

export default compose(
  withMetaResource,
  withRouter,
)(Logging);
