import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { metaActions } from 'modules/MetaResource';
import axios from 'axios';
import CircularActivity from 'components/CircularActivity';
import { Button, FileDownloadButton } from 'components/Buttons';
import { API_TIMEOUT } from '../../constants';

const fontSizes = {
  sm: 11,
  lg: 14,
};

const PageWrapper = styled.div`
  height: 100%;
  // position: relative;
`;

const Toolbar = styled.header`
  position: relative;
  min-height: 3.5em;
  width: 100%;
  position: fixed;
  background-color: white;
  z-index: 1;
`;

const ToolbarTitle = styled.div`
  padding-left: 1em;
`;

const ToolbarActions = styled.div`
  text-align: right;
`;

const FontSizeButton = styled(Button) `
  transform: ${props => `scaleX(${props.flipState || 1})`};
`;

const CodeWrapper = styled.div`
  height: 100%;
  background-color: black;
  padding-top: ${props => (props.fontSize === fontSizes.lg ? '4.5em' : '5.5em')};
  font-size: ${props => `${props.fontSize || fontSizes.lg}px`};
`;

const Pre = styled.pre`
  background: black;
  color: #eeeeee;
  white-space: pre;
  overflow-x: auto;
  position: relative;
  padding: 1em;
  margin: 0;
`;

const Code = styled.code`
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre-wrap;
  background-color: transparent;
  border-radius: 0;
`;

const LogItem = styled.div`
  font-family: "Ubuntu Mono", "lucida console", monospace;
  word-wrap: break-word;
`;

class Logging extends PureComponent {
  static propTypes = {
    // fqon: PropTypes.string.isRequired,
    // providerId: PropTypes.string.isRequired,
    // logId: PropTypes.string.isRequired,
    // logType: PropTypes.oneOf(['container', 'lambda']).isRequired,
    location: PropTypes.object.isRequired,
    fetchLogProvider: PropTypes.func.isRequired,
    logProviderURL: PropTypes.string.isRequired,
    logProviderPending: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      logs: [`${props.location.query.name} ${props.location.query.logType} has not logged any messages yet...`],
      logPending: false,
      fontSize: fontSizes.lg,
    };
  }

  componentDidMount() {
    const { location, fetchLogProvider } = this.props;

    if (!this.props.logProviderURL) {
      fetchLogProvider(location.query.fqon, location.query.providerId, location.query.logType);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logProviderURL !== this.props.logProviderURL) {
      this.fetchLogs(nextProps);
    }
  }

  fetchLogs(currentProps) {
    const { location } = this.props;
    const logAPI = axios.create({
      baseURL: currentProps.logProviderURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    this.setState({ logPending: true });

    logAPI.get(location.query.logId).then((response) => {
      this.setState({ logPending: false });

      if (response.data && response.data.length) {
        this.setState({ logs: response.data.reverse() });
      }
    }).catch(() => this.setState({ logPending: false }));
  }

  changeFontSize() {
    if (this.state.fontSize === fontSizes.lg) {
      this.setState({ fontSize: fontSizes.sm });
    } else {
      this.setState({ fontSize: fontSizes.lg });
    }
  }

  render() {
    const { location, logProviderPending } = this.props;

    return (
      <PageWrapper>
        <Toolbar>
          <div className="flex-row start-center">
            <ToolbarTitle className="flex-7">
              <div className="gf-headline-1">Logs for {location.query.name} ({location.query.logType})</div>
            </ToolbarTitle>
            <ToolbarActions className="flex-5">
              <Button
                icon
                tooltipLabel="Refresh Log"
                onClick={() => this.fetchLogs(this.props)}
              >refresh
              </Button>
              <FontSizeButton
                flipState={this.state.fontSize === fontSizes.lg ? 1 : -1}
                icon
                tooltipLabel="Toggle Font Size"
                onClick={() => this.changeFontSize()}
              >text_fields
              </FontSizeButton>
              <FileDownloadButton
                icon
                data={this.state.logs.join('\n')}
                tooltipLabel="Download Log"
                fileName={`${location.query.name}-${location.query.logType}.log`}
              />
              <Button
                icon
                tooltipLabel="Close"
                onClick={() => window.close()}
              >close
              </Button>
            </ToolbarActions>
          </div>
        </Toolbar>
        <CodeWrapper fontSize={this.state.fontSize}>
          {(logProviderPending || this.state.logPending) ? <CircularActivity id="log-loading" /> :
          <Pre>
            <Code>
              {this.state.logs.map((log, i) =>
                <LogItem key={i}>{log}</LogItem>)}
            </Code>
          </Pre>}
        </CodeWrapper>
      </PageWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    logProviderPending: state.metaResource.logProvider.pending,
    logProviderURL: state.metaResource.logProvider.logProvider.url,
  };
}

export default connect(mapStateToProps, Object.assign({}, metaActions))(Logging);
