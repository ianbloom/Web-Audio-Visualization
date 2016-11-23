$(document).ready(function () {
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	audioElement.crossOrigin = "anonymous";
	var audioSrc = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();
	analyser.maxDecibels = 1;

	// Bind our analyser to the media element source.
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);


	var frequencyData = new Uint8Array(32);
	var squareData = [0];

	var svgHeight = '768';
	var svgWidth = '1024';
	var midx = svgWidth/2.0;
	var midy = svgHeight/2.0;
	var twoPi = 2*Math.PI;

	var count = 0;

	function createSvg(parent, height, width) {
	  return d3.select(parent)
	  		   .append('svg')
	  		   .attr('height', height)
	  		   .attr('width', width);
	}

	var svg = createSvg('body', svgHeight, svgWidth);

	svg.selectAll('rect')
	   .data(squareData)
	   .enter()
	   .append('rect')
	   .attr('fill', 'rgb(0,0,0)')
	   .attr('x', 0)
	   .attr('y',0)
	   .attr('width',svgWidth)
	   .attr('height',svgHeight)

	// Create our initial D3 chart.
	svg.selectAll('circle')
	   .data(frequencyData)
	   .enter()
	   .append('circle')
	   .attr('stroke', 'rgb(255,255,255)')
	   .attr('stroke-width', 3);

	// Continuously loop and update chart with frequency data.
	function renderChart() {
	   requestAnimationFrame(renderChart);

	   // Copy frequency data to frequencyData array.
	   analyser.getByteFrequencyData(frequencyData);

	   // Update d3 chart with new data.
	   svg.selectAll('circle')
	      .data(frequencyData)
      	  .attr('cx', function(d,i) {
      	  	return midx + d * i/12 * Math.cos(twoPi * i/32 + 2 * count + (d/511));
      	  })
		  .attr('cy', function(d,i) {
		  	return midy + d * i/12 * Math.sin(twoPi * i/32 + 2 * count + (d/511));
		  })
	      .attr('r', function(d,i) {
	         return  .1 * d * (32-i);
	      })
	      .attr('fill', function(d, i) {
	         return 'rgb(' + Math.round(d * i/16) + ',' + 0 + ',' + i * 32 + ')';
	      });
	   count += .01;
	}

	// Run the loop
	renderChart();
});