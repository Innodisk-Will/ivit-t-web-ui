///////////////////////////////// PIECHART /////////////////////////////////////
///////////////////////////////// PIECHART /////////////////////////////////////
///////////////////////////////// PIECHART /////////////////////////////////////

// Pie chart of metrics (Chart)
function piechart_metrics(id, completed, Rejected, color){
  // Setup data
  const data = {
      datasets: [{
          data: [completed, Rejected],
          backgroundColor: [
              `${color}`,
              `${color}29`,
              ],
          borderWidth: 1,
      },]
  };
  
  // Config 
  const config = {
      renderTo: 'container',
      type: 'doughnut',
      data,
      options: {
          cutout:23,
          responsive: true,
          legend: {
            display: false
          }
      },
  };
    
  // Render init block
  METRICS_CHART = new Chart(
      document.getElementById(id),
      config,
  );
};

///////////////////////////////// CURVE /////////////////////////////////////
///////////////////////////////// CURVE /////////////////////////////////////
///////////////////////////////// CURVE /////////////////////////////////////

// Train/val curve 
function train_val_curve(id, dataset, xAxisKey, key){
  // Setup 
  const data = {
    datasets: dataset
  };

  // Config 
  const config = {
    type: 'line',
    data,
    options: {
      maintainAspectRatio: false,
      parsing:{
          xAxisKey,
      },
      scales: {
        y: {
          beginAtZero: false
        }
      },
      pointRadius: 1,
      // borderWidth: 3,
      pointHoverRadius: 5,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 7,
            boxHeight: 7,
            PointStyle:"rectRounded",
          },
        },
      }
    }
  };
  
  if (key == "train"){
      TRAIN_CURVE_CHART = new Chart(
                                      document.getElementById(id),
                                      config
                                    );
  }
  else if (key == "val"){
      VAL_CURVE_CHART = new Chart(
                                    document.getElementById(id),
                                    config
                                  );      
  };
};

// Update data in curve
function curve_updata(data){
  // Remove "0" value
  if (TRAIN_CURVE_CHART.data.labels.includes("0")){
    const index = TRAIN_CURVE_CHART.data.labels.indexOf("0");
    if (index > -1) {
      TRAIN_CURVE_CHART.data.labels.splice(index, 1);
      VAL_CURVE_CHART.data.labels.splice(index, 1);
    };
    TRAIN_CURVE_CHART.data.datasets[0].data.splice(0,1);
    VAL_CURVE_CHART.data.datasets[0].data.splice(0,1);
  };

  // Push label data
  TRAIN_CURVE_CHART.data.labels.push(data['step']);
  VAL_CURVE_CHART.data.labels.push(data['step']);

  // Sorted label
  TRAIN_CURVE_CHART.data.labels.sort(function(a,b){return a-b});
  VAL_CURVE_CHART.data.labels.sort(function(a,b){return a-b});

  // Push datasets data -> just only update one dataset, otherwise one point have two values 
  TRAIN_CURVE_CHART.data.datasets[0].data.push(data);
  VAL_CURVE_CHART.data.datasets[0].data.push(data);
  
  TRAIN_CURVE_CHART.update();
  VAL_CURVE_CHART.update();
};