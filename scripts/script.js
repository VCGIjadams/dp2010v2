$('document').ready(function() {

  d3.csv('../data/dictionary.csv').then(function(rows) {

    var table2vars = {};
    var var2desc = {};

    // Generate a list of tables and populate variables
    for (i = 0; i < rows.length; i++) {
      var code = rows[i].Code;
      var desc = rows[i].Description;
      
      if (code.length === 3) {
        $('#tables').append('<option value="' + code + '">' + desc + '</option>');
      } else {
        var table = code.substr(0, 3);
        
        if (!table2vars[table]) {
          table2vars[table] = [];
        }

        table2vars[table].push(code);
        var2desc[code] = desc;

      }
    }

    // When table is changed, re-generate list of variables
    $('#tables').change(function() {

      // Remove variables from previous table
      $('#variables').html('');
      var table = $('#tables option:selected').attr('value');

      // Populate new variables
      table2vars[table].map(function(v) {
        $('#variables').append( '<option value="' + v + '">' + var2desc[v] + '</option>' )
      });

      // Trigger changes in Variables so that chart refreshes on Table change
      $('#variables').change();

    });


    // Load data
    d3.csv('../data/data.csv').then(function(rows) {

      $('#variables').change(function() {
        var currentVar = $('#variables option:selected').attr('value');
        
        var labels = rows.map(function(o) {return o.name_dp});
        var valuesBefore = rows.map(function(o) {return parseFloat(o[currentVar + '_sf'])});
        var valuesAfter = rows.map(function(o) {return parseFloat(o[currentVar + '_dp'])});
        var valuesChange = [];

        for (var i = 0; i < valuesBefore.length; i++) {
          valuesChange.push( ((valuesAfter[i] - valuesBefore[i]) / valuesBefore[i] * 100).toFixed(1) );
        }

        allTowns.data.labels = labels;
        allTowns.data.datasets[0].data = valuesChange;
        allTowns.update();
      });

      // Initial load
      $('#tables').change();

    })

  })

})