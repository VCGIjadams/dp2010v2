$('document').ready(function() {

  $('.tab').click(function() {
    $('.tab').removeClass('active bt bl br bb');
    $(this).addClass('active');
    $('.tab.active').addClass('bt bl br');
    $('.tab:not(.active)').addClass('bb');

    $('.tab-contents').hide();
    $( '#' + $(this).html() + 'Tab' ).show();
  });

  var getChange = function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    var change = ( (a-b)/b * 100 ).toFixed(1);
    return (isNaN(change) || !isFinite(change)) ? null : change;
  }

  var datatable = $('#table1').DataTable({
    data: [],
    paging: false,
    bInfo: false,
    columns: [
      {
        title: 'Variable'
      },
      {
        title: 'Before',
        className: 'tr',
        'render': function(a) { return Number(a).toLocaleString('en') }
      },
      {
        title: 'After',
        className: 'tr',
        'render': function(a) { return Number(a).toLocaleString('en') }
      },
      {
        title: '% Change',
        className: 'tr',
      },
    ],
    searching: false
  });


  var datatable2 = $('#table2').DataTable({
    data: [],
    paging: true,
    //bInfo: false,
    lengthMenu: [
      [10, 25, -1],
      [10, 25, "All"]
    ],
    columns: [
      {
        title: 'Town'
      },
      {
        title: 'Population',
        visible: false,
      },
      {
        title: 'Before',
        className: 'tr',
        'render': function(a) { return Number(a).toLocaleString('en') }
      },
      {
        title: 'After',
        className: 'tr',
        'render': function(a) { return Number(a).toLocaleString('en') }
      },
      {
        title: '% Change',
        className: 'tr',
      },
    ],
    searching: true
  });

  $('#VariablesTab').hide();

  d3.csv('./data/dictionary.csv').then(function(rows) {

    var table2vars = {};
    var var2desc = {};

    // Generate a list of tables and populate variables
    for (i = 0; i < rows.length; i++) {
      var code = rows[i].Code;
      var desc = rows[i].Description;
      
      if (code.length === 3) {
        $('#tables').append('<option value="' + code + '">' + desc + '</option>');
        $('#tables2').append('<option value="' + code + '">' + desc + '</option>');
      } else {
        var table = code.substr(0, 3);
        
        if (!table2vars[table]) {
          table2vars[table] = [];
        }

        table2vars[table].push(code);
        var2desc[code] = desc;

      }
    }

    // Changes by variable by town: update Variables list on table change
    $('#tables2').change(function() {
      var table2 = $('#tables2 option:selected').attr('value');
      $('#variables').html('');
      table2vars[table2].map(function(v) {
        $('#variables').append('<option value="' + v + '">' + var2desc[v] + '</option>');
      });
      $('#variables').change();
    });


    // Load data
    d3.csv('./data/data.csv').then(function(rows) {

      rows.map(function(row) {
        $('#towns').append('<option value="' + row.name_dp + '">' + row.name_dp + '</option>');
      });

      // Changes by table
      $('#tables, #towns').change(function() {

        var table = $('#tables option:selected').attr('value');
        var town = $('#towns option:selected').attr('value');
        var labels = [];
        var before = [];
        var after = [];
      
        table2vars[table].map(function(v) {
          labels.push( var2desc[v] );
          before.push( rows.filter(function(r) { return r.name_dp === town })[0][v + '_sf'] )
          after.push( rows.filter(function(r) { return r.name_dp === town })[0][v + '_dp'] )
        });

        // Update horizontal bar chart
        chart1.data.labels = labels;
        chart1.data.datasets[0].data = before;
        chart1.data.datasets[1].data = after;
        chart1.update();

        // Update data table
        datatable.clear();
        for (var i = 0; i < labels.length; i++) {
          var change = getChange( after[i], before[i] );
          datatable.rows.add([ [labels[i], before[i], after[i], change ? change + '%' : ''] ]);
        }
        datatable.draw();

      });


      // Town population filter for datatable2
      $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
          var range = $('input[name="townsize"]:checked')
            .attr('value').split('-').map(function(x) { return parseInt(x) });
            
          if (range[1] === 1) return true;

          var pop = parseInt( data[1], 10 );

          if (pop >= range[0] && pop <= range[1]) {
            return true;
          }

          return false;
        }
      );
      
      $('input[name="townsize"]').change(function() { datatable2.draw() });

      // Changes by variable
      $('#variables').change(function() {

        var variable = $('#variables option:selected').attr('value');
        var towns = [];
        var before = [];
        var after = [];
        var change = [];
        var pop = [];
      
        rows.map(function(row) {
          var b = parseFloat(row[ variable + '_sf']);
          var a = parseFloat(row[ variable + '_dp']);
          towns.push( row.name_dp );
          before.push( b );
          after.push( a );
          change.push( getChange( a, b ) );
          pop.push( parseInt(row['H7V001_sf']) );
        });
        
        // Update data table
        datatable2.clear();
        for (var i = 0; i < towns.length; i++) {
          var change = getChange(after[i], before[i]);
          datatable2.rows.add([ [towns[i], pop[i], before[i], after[i], change ? change + '%' : ''] ])
        }
        datatable2.draw();

      });

      // Initial load: Tables
      $('#tables').val('H7X');
      $('#towns').val('Hartford').change();

      // Initial load: Variables
      $('#tables2').val('H7X').change();
      $('#variables').val('H7X003').change();

    })

  })

})