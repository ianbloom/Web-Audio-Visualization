$(document).ready(function () {
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	audioElement.crossOrigin = "anonymous";
	var audioSrc = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();
	analyser.maxDecibels = 1;
	analyser.frequencyBinCount = 64;

	// Bind our analyser to the media element source.
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);
	
	var frequencyData = new Uint8Array(64);
	var filterData = [];
	
	var squareCount = frequencyData.length;

	var svgHeight = '768';
	var svgWidth = '1024';
	var rectHeight = svgHeight/8;
	var rectWidth = svgHeight/8;
	rowCount = -1;
	
	var midx = svgWidth/2.0;
	var midy = svgHeight/2.0;
	var twoPi = 2*Math.PI;

	var count = 0;
	var tally = [];
	for(j=0; j<squareCount; j++) {
		tally.push(0);
	}

	for(var j=0; j<squareCount; j++) {
		filterData[j] = [['rgb(' + Math.round(255 * ((Math.sin(twoPi * j / squareCount) + 1)/2))
								+ ',' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount) + 1)/2)) 
								+ ',' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount) + 1)/2))
								+ ')', j + '%'],
						 ['rgb(' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount) + 1)/2))
								+ ',' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount) + 1)/2)) 
								+ ',' + Math.round(255 * ((Math.sin(twoPi * j / squareCount) + 1)/2))
								+ ')', j + ((100-j)/2) + '%'],
						 ['rgb(' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount) + 1)/2))
								+ ',' + Math.round(255 * ((Math.sin(twoPi * j / squareCount) + 1)/2)) 
								+ ',' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount) + 1)/2))
								+ ')', '100%']
						 ];
	}

	function createSvg(parent, height, width) {
	  return d3.select(parent)
	  		   .append('svg')
	  		   .attr('height', height)
	  		   .attr('width', width);
	}

	var svg = createSvg('body', svgHeight, svgWidth);

	var defs = svg.append('defs');
	
	var radialGrad = defs.selectAll('radialGradient')
						 .data(filterData)
						 .enter()
						 .append('radialGradient')
						 .attr('id', function(d,i) {
							return 'radGrad' + i;
						 })
						 .selectAll('stop')
						 .data(function(d,i) {
							return d;
						 })
						 .enter()
						 .append('stop')
						 .attr('offset', function(d,i) {
							return d[1];
						 })
						 .attr('stop-color', function(d,i) {
						 return d[0];
						 });
	//Make background black
	/*svg.selectAll('rect')
	   .data(squareData)
	   .enter()
	   .append('rect')
	   .attr('fill', 'rgb(0,0,0)')
	   .attr('x', 0)
	   .attr('y',0)
	   .attr('width',svgWidth)
	   .attr('height',svgHeight)*/

	//Draw rectangles
	svg.selectAll('rect')
	   .data(frequencyData)
	   .enter()
	   .append('rect')
	   .attr('x', function(d,i) {
			return rectWidth * (i%8);
	   })
	   .attr('y', function(d, i) {
		   	if(i%8 == 0) {
				rowCount += 1;
			}
			return rectHeight * rowCount;
	   })
	   .attr('width', rectWidth)
	   .attr('height', rectHeight)
	   .attr('fill',function(d,i) {
			return 'url(#radGrad' + i + ')'
	   });

	// Continuously loop and update chart with frequency data.
	function renderChart() {
	   requestAnimationFrame(renderChart);

	   // Copy frequency data to frequencyData array.
	   analyser.getByteFrequencyData(frequencyData);
	   for(j=0; j<frequencyData.length; j++) {
		    tally[j] = count + frequencyData[j]/100;
	   		for(i=0; i<3; i++) {
	   			if(i==0) {
	   				filterData[j][i][0] = 'rgb(' + Math.round(255 * ((Math.sin(twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ',' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount + tally[j]) + 1)/2)) 
										+ ',' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ')';
					console.log(filterData[0][0][0]);
	   				var temp = Math.round(100 * frequencyData[j]/200);
	   				filterData[j][i][1] = '0%'
	   			}
	   			if(i==1) {
					filterData[j][i][0] = 'rgb(' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ',' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount + tally[j]) + 1)/2)) 
										+ ',' + Math.round(255 * ((Math.sin(twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ')';
	   				filterData[j][i][1] = temp + '%';
	   			}
	   			if(i==2) {
					filterData[j][i][0] = 'rgb(' + Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ',' + Math.round(255 * ((Math.sin(twoPi * j / squareCount + tally[j]) + 1)/2)) 
										+ ',' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * j / squareCount + tally[j]) + 1)/2))
										+ ')';
	   				filterData[j][i][1] = '100%'
	   			}
	   		}
	   }

	 defs.selectAll('radialGradient')
		 .data(filterData)
		 .selectAll('stop')
		 .data(function(d,i) {
			return d;
		 })
		 .attr('offset', function(d,i) {
			return d[1];
		 })
		 .attr('stop-color', function(d,i) {
		 return d[0];
		});
	if(frequencyData[0] > 0) {
		count += .05;
	}
	}
	// Run the loop
	renderChart();
});