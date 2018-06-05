import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import Log from 'components/Log';
import { Line } from 'react-chartjs-2';
import { Caption } from 'components/Typography';
// import { Button } from 'components/Buttons';
// import moment from 'moment';

const Metrics = styled.div`
  width: 100%;
  height: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Metric = styled.div`
  font-size: 48px;
  text-align: center;
  padding: 8px;
  margin-top: 32px;
  width: 100%;

  &:first-child {
    border-right: 1px solid #E0E0E0;
  }
`;

const Charts = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 190px;
  padding: 16px;
`;

class StreamInstance extends Component {
  static propTypes = {
    fqon: PropTypes.string.isRequired,
    streamId: PropTypes.string.isRequired,
    persistenceId: PropTypes.string.isRequired,
  };

  state = {
    isPolling: false,
    // logItems: [{ topic: 'avro-output', partition: 0, offset: 0, value: 'DHJlY29yZAAB', key: 'test-key' }, { topic: 'avro-output', partition: 0, offset: 1, value: 'DHJlY29yZAIA', key: 'test-key' }, { topic: 'avro-output', partition: 0, offset: 2, value: 'DHJlY29yZAQB', key: 'test-key' }, { topic: 'avro-output', partition: 0, offset: 3, value: 'DHJlY29yZAYA', key: 'test-key' }, { topic: 'avro-output', partition: 0, offset: 4, value: 'DHJlY29yZAgB', key: 'test-key' }],
    logItems: [],
    metrics: {
      numProcessed: 0,
      numPerMinute: 0,
    },
    numProcessedData: {
      labels: Array.from({ length: 9 }),
      datasets: [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#2196f3',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#2196f3',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#2196f3',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Array.from({ length: 9 }),
        }
      ]
    },
    numPerMinuteData: {
      labels: Array.from({ length: 9 }),
      datasets: [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#ffc107',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#ffc107',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#ffc107',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Array.from({ length: 9 }),
        }
      ]
    },
  };

  componentDidMount() {
    this.getStreamMetric();
  }

  componentWillUnmount() {
    clearInterval(this.streamMetricPoll);
  }

  setChartOptions(title) {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: true,
        text: title,
        fontSize: 16,
      },
      animation: {
        duration: 0,
      },
      scales: {
        yAxes: [{
          display: true,
          position: 'right',
          ticks: {
            beginAtZero: true,
            min: 0,
            suggestedMax: 100,
            // stepSize: 100,
          },
        }],
        xAxes: [{
          display: false,
        }]
      }
    };
  }

  getLog = async () => {
    const logAPI = axios.create({
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const response = await logAPI.get('https://gtw1.test.galacticfog.com/test/consume?startOffset=59007&numResults=5');
    this.setState({
      logItems: response.data,
    });
  }

  getStreamMetric = async () => {
    const { fqon, streamId, persistenceId } = this.props;

    this.setState({ error: null });

    try {
      const response = await axios.post(`${fqon}/streamspecs/${streamId}?action=viewstatus&persistenceId=${persistenceId}`);
      this.setState({
        metrics: response.data,
      });

      this.incrementChart('numProcessedData', response.data.numProcessed);
      this.incrementChart('numPerMinuteData', response.data.numPerMinute);

      this.pollStreamMetric();
    } catch (error) {
      this.setState({ error });
    }
  }

  pollStreamMetric = () => {
    clearInterval(this.streamMetricPoll);
    this.setState({ isPolling: true });

    this.streamMetricPoll = setInterval(() => this.getStreamMetric(), 3000);
  }

  stopPolling = () => {
    clearInterval(this.streamMetricPoll);
    this.setState({ isPolling: false });
  }


  incrementChart(report, num) {
    const datasetsCopy = this.state[report].datasets.slice(0);
    // const labelsCopy = this.state[report].labels.slice(0);
    const dataCopy = datasetsCopy[0].data.slice(0);
    // dataCopy.push(num + Math.floor(Math.random() * 100));
    dataCopy.push(num);
    // labelsCopy.push(moment().format('hh:mm:ss'));

    if (datasetsCopy[0].data.length >= 9) {
      dataCopy.shift();
      // labelsCopy.shift();
    }

    datasetsCopy[0].data = dataCopy;

    this.setState({
      [report]: Object.assign({}, this.state[report], {
        datasets: datasetsCopy,
        // labels: labelsCopy,
      })
    });
  }

  render() {
    return (
      <React.Fragment>
        <Charts>
          <div>
            <Line
              data={this.state.numProcessedData}
              options={this.setChartOptions('Processed')}
              width={325}
            />
          </div>

          <Metrics>
            <Metric>
              {this.state.metrics.numProcessed}
              <Caption block>Current</Caption>
            </Metric>
            <Metric>
              {this.state.metrics.numPerMinute}
              <Caption block>Current</Caption>
            </Metric>

            {/* <div>
              <Button flat onClick={this.pollStreamMetric} disabled={this.state.isPolling}>Start</Button>
            </div>
            <div>
              <Button flat onClick={this.stopPolling} disabled={!this.state.isPolling}>Stop</Button>
            </div> */}
          </Metrics>

          <div>
            <Line
              data={this.state.numPerMinuteData}
              options={this.setChartOptions('Per Minute')}
              width={325}
            />
          </div>
        </Charts>

        <Log logItems={this.state.logItems} />
      </React.Fragment>
    );
  }
}

export default StreamInstance;
