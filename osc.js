$(document).ready(function () {
	/*var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	audioElement.crossOrigin = "anonymous";
	var audioSrc = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();
	analyser.maxDecibels = 1;
	analyser.frequencyBinCount = 64;

	// Bind our analyser to the media element source.
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);
	
	var frequencyData = new Uint8Array(64);*/
	var frequencyData = [];

	//[x1, y1, x2, y2, style]
	
	var lineCount = frequencyData.length;

	var svgHeight = '768';
	var svgWidth = '1024';
	
	var midx = svgWidth/2.0;
	var midy = svgHeight/2.0;
	var twoPi = 2*Math.PI;
	var linX = svgWidth/100;
	var linY = svgHeight/100;

	for(var i=0; i<100; i++) {
		frequencyData[i] = [i*linX,
							0,
							0,
							svgHeight-(i*linY)];
	}
	for(var j=1; j<100; j++) {
		frequencyData.push([svgWidth,
							j*linY,
							svgWidth-(j*linX),
							svgHeight]);	
		console.log('j=' + frequencyData[j])
	}
	
	var count = 0;

	function createSvg(parent, height, width) {
	  return d3.select(parent)
	  		   .append('svg')
	  		   .attr('height', height)
	  		   .attr('width', width);
	}

	var svg = createSvg('body', svgHeight, svgWidth);
	
	var lines = svg.selectAll('line')
				   .data(frequencyData)
				   .enter()
				   .append('line')
				   .attr('x1', function(d,i) {
						return d[0];
					})
				   .attr('y1', function(d,i) {
						return d[1];
					})
				   .attr('x2', function(d,i) {
						return d[2];
					})
				   .attr('y2', function(d,i) {
						return d[3];
					})
				   .attr('style', 'stroke:rgb(0,0,0)');

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


	// Continuously loop and update chart with frequency data.
	/*function renderChart() {
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
	renderChart();*/
});