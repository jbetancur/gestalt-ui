import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Caption } from 'components/Typography';
import { Row, Col } from 'react-flexybox';

const calculateMetrics = (metricData, id) => {
  const metrics = metricData.monitor.lambdas.filter(lm => lm.id === id).flatMap(e => e.executors);

  return {
    numExecutors: metrics.length,
    numProcessed: metrics
      .reduce((a, b) => a + b.lambdasProcessed, 0),
    averageRuntime: metrics.length > 0 && metrics[0].lambdasPerSecond ? (1 / metrics[0].lambdasPerSecond).toPrecision(3) : 0
    // lambdasPerSecond: metrics.length && metrics[0].lambdasPerSecond ? metrics[0].lambdasPerSecond.toFixed(3) : 0,
  };

  // TODO: add back when lambdasPerSecond is real
  // metrics
  //   .filter(e => e.lambdasPerSecond > 0)
  //   .reduce((a, b) => a + (metrics[0].lambdasProcessed / b.lambdasPerSecond), 0),
};

const Metric = styled.div`
  text-align: center;
  padding: 8px;
  width: 100%;
  font-size: 32px;
  word-break: break-word;

  &:not(:last-child) {
    border-right: 1px solid #E0E0E0;
  }
`;

class LambdaStats extends Component {
  static propTypes = {
    fqon: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    lambdaId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.maxChart = 10;
    this.state = {
      isPolling: false,
      metrics: {},
      numExecutorsData: {
        labels: new Array(this.maxChart).fill('executors'),
        datasets: [
          {
            fill: true,
            backgroundColor: 'rgba(33,150,243,.4)',
            lineTension: 0.1,
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
            pointRadius: 2,
            pointHitRadius: 10,
            label: 'Number of Executors',
            data: Array.from({ length: this.maxChart }),
          }
        ]
      },
      numProcessedData: {
        labels: new Array(this.maxChart).fill('invoked'),
        datasets: [
          {
            cubicInterpolationMode: 'monotone',
            fill: true,
            backgroundColor: 'rgba(76,175,80,.4)',
            lineTension: 0.1,
            borderColor: '#4CAF50',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#4CAF50',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#4CAF50',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
            label: 'Invoked',
            data: Array.from({ length: this.maxChart }),
          }
        ]
      },
      averageRuntimeData: {
        labels: new Array(this.maxChart).fill('runtime'),
        datasets: [
          {
            cubicInterpolationMode: 'monotone',
            fill: true,
            backgroundColor: 'rgba(236,64,122,.4)',
            lineTension: 0.1,
            borderColor: '#ec407a',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ec407a',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ec407a',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
            label: 'Average Runtime',
            data: Array.from({ length: this.maxChart }),
          }
        ]
      },
    };
  }

  componentDidMount() {
    this.cancelSource = axios.CancelToken.source();
    this.getMetrics();
  }

  componentWillUnmount() {
    clearInterval(this.metrics);
    this.cancelSource.cancel();
  }

  setChartOptions(title, { max = 10, type = 'logarithmic' } = {}) {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: true,
        mode: 'single',
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
            // suggestedMax: max,
            min: 0,
            type,
            ticks: {
              min: 0,
              max,
            }
          },
        }],
        xAxes: [{
          display: false,
        }]
      }
    };
  }

  getMetrics = async () => {
    const { fqon, providerId, lambdaId } = this.props;

    this.setState({ error: null });

    try {
      const { data } = await axios.post(`${fqon}/providers/${providerId}?action=viewmetrics`, null, {
        cancelToken: this.cancelSource.token
      });
      const metrics = calculateMetrics(data, lambdaId);

      this.setState({
        metrics,
      });

      this.incrementChart('numExecutorsData', metrics.numExecutors);
      this.incrementChart('numProcessedData', metrics.numProcessed);
      this.incrementChart('averageRuntimeData', metrics.averageRuntime);

      this.pollMetrics();
    } catch (error) {
      this.setState({ error });
    }
  }

  pollMetrics = () => {
    clearInterval(this.metrics);
    this.setState({ isPolling: true });

    this.metrics = setInterval(() => this.getMetrics(), 3000);
  }

  stopPolling = () => {
    clearInterval(this.metrics);
    this.setState({ isPolling: false });
  }

  incrementChart(report, num) {
    this.setState((prevState) => {
      const datasetsCopy = prevState[report].datasets.slice(0);
      const dataCopy = datasetsCopy[0].data.slice(0);
      // dataCopy.push(num + Math.floor(Math.random() * 4000));
      dataCopy.push(num);

      if (datasetsCopy[0].data.length >= this.maxChart) {
        dataCopy.shift();
      }

      datasetsCopy[0].data = dataCopy;

      return {
        [report]: Object.assign({}, prevState[report], {
          datasets: datasetsCopy,
        })
      };
    });
  }

  render() {
    return (
      <Row gutter={5} center>
        <Col flex={8} xs={12} sm={12}>
          <Line
            data={this.state.numExecutorsData}
            options={this.setChartOptions('Total Executors', { type: 'linear', max: 5 })}
          />
        </Col>

        <Col flex={4} xs={12} sm={12}>
          <Metric>
            {this.state.metrics.numExecutors || 0}
            <Caption block>Current Total Executors</Caption>
          </Metric>
        </Col>


        <Col flex={8} xs={12} sm={12}>
          <Line
            data={this.state.numProcessedData}
            options={this.setChartOptions('Total Invocations')}
          />
        </Col>

        <Col flex={4} xs={12} sm={12}>
          <Metric>
            {this.state.metrics.numProcessed || 0}
            <Caption block>Current Total Invocations</Caption>
          </Metric>
        </Col>

        <Col flex={8} xs={12} sm={12}>
          <Line
            data={this.state.averageRuntimeData}
            options={this.setChartOptions('Average Runtime/Seconds', { max: 1 })}
          />
        </Col>

        <Col flex={4} xs={12} sm={12}>
          <Metric>
            {this.state.metrics.averageRuntime || 0}
            <Caption block>Current Average Runtime/Seconds</Caption>
          </Metric>
        </Col>
      </Row>
    );
  }
}

export default LambdaStats;
