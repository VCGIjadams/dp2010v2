Chart.defaults.global.defaultFontColor = "black";

var ctx = document.getElementById('chart1').getContext('2d');
var chart1 = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [{
        label: 'Before DP',
        data: [],
        backgroundColor: 'silver'
      },{
        label: 'After DP',
        data: [],
        backgroundColor: 'blue'
      }]
    },
    options: {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label
              + ': ' + tooltipItem.xLabel.toLocaleString();
          },
          title: function(tooltipItem) {
            return tooltipItem[0].label;
          }
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
          },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: '#666',
            zeroLineColor: '#666',
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
          },
          ticks: {
            display: true,
            beginAtZero: true,
            callback: function(val) {
              return val.toLocaleString()
            }
          },
          gridLines: {
            display: true,
            color: '#666',
            zeroLineColor: '#666',
          }
        }],
      }
    }
});