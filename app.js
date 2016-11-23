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


	var frequencyData = new Uint8Array(20);
	var filterData = [1];

	var svgHeight = '768';
	var svgWidth = '1024';
	var barPadding = '1';

	var count = 0;

	function createSvg(parent, height, width) {
	  return d3.select(parent)
	  		   .append('svg')
	  		   .attr('height', height)
	  		   .attr('width', width)
	}

	var svg = createSvg('body', svgHeight, svgWidth);

	var defs = svg.append('defs');

	var filter = defs.append('filter')
				 	 .attr('id', 'swerve')
				 	 .attr('x', 0)
				 	 .attr('y', 0);

	var gauss = filter.append('feGaussianBlur')
					  .attr('in', 'SourceGraphic')
					  .attr('stdDeviation', 15);

	// Create our initial D3 chart.
	svg.selectAll('rect')
	   .data(frequencyData)
	   .enter()
	   .append('rect')
	   .attr('x', function (d, i) {
	      return i * (svgWidth / frequencyData.length);
	   })
	   .attr('width', svgWidth / frequencyData.length - barPadding);

	// Continuously loop and update chart with frequency data.
	function renderChart() {
	   requestAnimationFrame(renderChart);

	   // Copy frequency data to frequencyData array.
	   analyser.getByteFrequencyData(frequencyData);

	   // Update d3 chart with new data.
	   svg.selectAll('rect')
	      .data(frequencyData)
	      .attr('stroke', function(d, i) {
	      	 return 'rgb(' + Math.round(Math.abs(Math.sin(Math.PI * i/20 + count)) * 255) + ',0,0)';
	      })
	      .style('filter', 'url(#swerve)')
	      .attr('y', function(d) {
	         return svgHeight - 2 * d;
	      })
	      .attr('height', function(d) {
	         return  2 * d;
	      })
	      .attr('fill', function(d) {
	         return 'rgb(0, 0, ' + d + ')';
	      });
	   count += .01;
	}

	// Run the loop
	renderChart();
});