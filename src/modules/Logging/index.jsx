import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { metaActions } from 'modules/MetaResource';
import axios from 'axios';
import SelectField from 'react-md/lib/SelectFields';
import CircularActivity from 'components/CircularActivity';
import { Button, FileDownloadButton } from 'components/Buttons';
import { API_TIMEOUT } from '../../constants';

const timeSpans = [
  {
    name: 'Show All',
    value: 'all',
  },
  {
    name: 'Last 5 Minutes',
    value: '5m',
  },
  {
    name: 'Last 15 Minutes',
    value: '15m',
  },
  {
    name: 'Last Hour',
    value: '1h',
  },
  {
    name: ' Last 2 Hours',
    value: '2h',
  },
  {
    name: 'Last Day',
    value: '1d',
  },
];

const fontSizes = {
  sm: 11,
  lg: 14,
};

const PageWrapper = styled.div`
  height: 100%;
  position: relative;
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

const ToolbarControls = styled.div`
  text-align: left;
  display: inline-block;
  vertical-align: top;
  margin-top: .3em;
`;

const FontSizeButton = styled(Button)`
  i {
    transform: ${props => `scaleX(${props.flipState || 1})`};
  }
`;

const CodeWrapper = styled.div`
  position: relative;
  height: 100%;
  background-color: black;
  padding-top: ${props => (props.fontSize === fontSizes.lg ? '4.5em' : '5.5em')};
  font-size: ${props => `${props.fontSize || fontSizes.lg}px`};

  @media screen and (max-width: 599px) {
    padding-top: ${props => (props.fontSize === fontSizes.lg ? '7.5em' : '8.5em')};
  }
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

const ScrollButtons = styled.div`
  position: fixed;
  z-index: 9999;
  top: 46%;
  height: 100px;
  right: 1em;
`;

const TopScrollButton = styled(Button)`
  color: white;
  display: block;
`;

const BottomScrollButton = styled(Button)`
  color: white;
  display: block;
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
      logTimespan: 'all',
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
      this.fetchLogs(nextProps, this.state);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.logTimespan !== this.state.logTimespan) {
      this.fetchLogs(nextProps, nextState);
    }
  }

  fetchLogs(currentProps, currentState) {
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

    const time = (currentState.logTimespan && currentState.logTimespan !== 'all') ? `?time=${currentState.logTimespan}` : '';

    logAPI.get(`${location.query.logId}${time}`).then((response) => {
      this.setState({ logPending: false });

      if (response.data && response.data.length) {
        this.setState({ logs: response.data });
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
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
            <ToolbarTitle className="flex-xs-12 flex-sm-6 flex-md-6 flex-lg-8">
              <div className="gf-headline-1">Logs for {location.query.name} ({location.query.logType})</div>
            </ToolbarTitle>
            <ToolbarActions className="flex-xs-12 flex-sm-6 flex-md-6 flex-lg-4">
              <ToolbarControls>
                <SelectField
                  id="log--timespan"
                  menuItems={timeSpans}
                  itemLabel="name"
                  itemValue="value"
                  defaultValue={this.state.logTimespan}
                  lineDirection="center"
                  position="below"
                  disabled={logProviderPending || this.state.logPending}
                  onChange={value => this.setState({ logTimespan: value })}
                />
              </ToolbarControls>
              <Button
                icon
                tooltipLabel="Refresh Log"
                onClick={() => this.fetchLogs(this.props, this.state)}
                disabled={logProviderPending || this.state.logPending}
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
                disabled={logProviderPending || this.state.logPending}
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
          <div>
            <ScrollButtons>
              <TopScrollButton
                icon
                primary
                tooltipLabel="Scroll to Top"
                tooltipPosition="left"
                onClick={() => window.scrollTo(0, 0)}
              >arrow_upward
              </TopScrollButton>
              <BottomScrollButton
                icon
                primary
                tooltipLabel="Scroll to Bottom"
                tooltipPosition="left"
                onClick={() => window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)}
              >arrow_downward
            </BottomScrollButton>
            </ScrollButtons>
            <Pre>
              <Code>
                {this.state.logs.map((log, i) =>
                  <LogItem key={i}>{log}</LogItem>)}
              </Code>
            </Pre>
          </div>}
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
