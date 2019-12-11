var bigTowns = [
  'Hartford',
  'New Haven',
  'Bridgeport',
  'Danbury',
  'Stamford',
  'Norwalk',
  'Waterbury'
];

var ctx = document.getElementById('chart2').getContext('2d');
var chart2 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '% Change',
        data: [],
        backgroundColor: 'blue'
      }]
    },
    plugins: [ChartDataLabels],
    options: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '% Change'
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Towns'
          },
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          }
        }]
      },
      plugins: {
        datalabels: {
          align: 'start',
          anchor: 'top',
          offset: 10,
          //offset: -10,
          //clamp: true,

          /*
          color: function(context) {
            return 'orange'
          }, */

          //rotation: 320,

          display: function(context) {
            return bigTowns.indexOf( context.chart.data.labels[context.dataIndex]) > -1;
          },

          formatter: function(value, context) {
            return context.chart.data.labels[context.dataIndex];
          }
        }
      }
    }
});