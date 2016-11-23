$(document).ready(function () {
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	audioElement.crossOrigin = "anonymous";
	var audioSrc = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();
	analyser.maxDecibels = 1;
	analyser.frequencyBinCount = 10;

	// Bind our analyser to the media element source.
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);


	var frequencyData = new Uint8Array(10);
	var squareData = [0];
	var filterData = [];
	var colorStep = 10;
	var changeRate = .5;

	var svgHeight = '768';
	var svgWidth = '1024';
	var midx = svgWidth/2.0;
	var midy = svgHeight/2.0;
	var twoPi = 2*Math.PI;

	for(var i=0; i<frequencyData.length; i++) {
		filterData[i] = ['rgb(' + Math.round(255 * ((Math.sin(twoPi * i / 10) + 1) / 2)) + ',' 
								+ Math.round(255 * ((Math.sin((twoPi/3) + twoPi * i / 10) + 1) / 2)) + ','
								+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * i / 10) + 1) / 2)) + ')'
						, 
						'rgb(' + Math.round(255 * ((Math.sin(twoPi * (i+colorStep) / 10) + 1) / 2)) + ',' 
								+ Math.round(255 * ((Math.sin((twoPi/3) + twoPi * (i+colorStep) / 10) + 1) / 2)) + ','
								+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * (i+colorStep) / 10) + 1) / 2)) + ')'
						,
						'rgb(' + Math.round(255 * ((Math.sin(twoPi * i / 10) + 1) / 2)) + ',' 
								+ Math.round(255 * ((Math.sin((twoPi/3) + twoPi * i / 10) + 1) / 2)) + ','
								+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * i / 10) + 1) / 2)) + ')'
						,
						'rgb(0,0,0)'];
	}

	var count = 0;

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
						 // Select stops and fill them with data from filterData[i]
						 .selectAll('stop')
						 .data(function(d,i) {
						 	 return d;
						 })
						 .enter()
						 .append('stop')
						 .attr('offset', function(d,i) {
						  	if( i == 0) {
						  		return '0%';
						  	}
						  	if( i == 1) {
						  		return '50%';
						  	}
						  	if( i == 2) {
						  		return '75%';
						  	}
						  	else {
						  		return '100%';
						  	}
						  })
						  .attr('stop-color', function(d) {
						  	return d;
						 });

	//Math.round(255 * ((Math.sin(twoPi * i/32.0) + 1)/2))

	//Make background black
	svg.selectAll('rect')
	   .data(squareData)
	   .enter()
	   .append('rect')
	   .attr('fill', 'rgb(0,0,0)')
	   .attr('x', 0)
	   .attr('y',0)
	   .attr('width',svgWidth)
	   .attr('height',svgHeight)

	//Draw circles
	svg.selectAll('circle')
	   .data(frequencyData)
	   .enter()
	   .append('circle')
	   .attr('fill', function(d,i) {
	   	 return 'url(#radGrad' + i + ')';
	   });
	   //.attr('stroke', 'rgb(255,255,255)')
	   //.attr('stroke-width', 3);


	// Continuously loop and update chart with frequency data.
	function renderChart() {
	   requestAnimationFrame(renderChart);

	   // Copy frequency data to frequencyData array.
	   analyser.getByteFrequencyData(frequencyData);

	   // Calculate color gradient to close gap between links
	   /*for(i = 0; i<frequencyData.length; i++){
   		   filterData[i] = ['rgb(' + Math.round(255 * ((Math.cos(twoPi * i/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((twoPi/3) + twoPi * i/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((2 * twoPi/3) + twoPi * i/32.0 + 2 * count) + 1)/2)) + ')',
	   	 			 'rgb(' + Math.round(255 * ((Math.cos(twoPi * (i + 1)/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((twoPi/3) + twoPi * (i + 1)/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((2 * twoPi/3) + twoPi * (i + 1)/32.0 + 2 * count) + 1)/2)) + ')'];
		   console.log(filterData[i][0]);
	   }*/
	   	colorStep += .02;

	   	for(var i=0; i<frequencyData.length; i++) {
			Math.round(255 * ((Math.sin(twoPi * i / 10) + 1) / 2))
			filterData[i] = ['rgb(' + Math.round(255 * ((Math.sin(twoPi * i / 10 + changeRate * count) + 1) / 2)) + ',' 
									+ Math.round(255 * ((Math.sin((twoPi/3) + twoPi * i / 10 + changeRate * count) + 1) / 2)) + ','
									+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * i / 10 + changeRate * count) + 1) / 2)) + ')'
							, 
							'rgb(' + Math.round(255 * ((Math.sin(twoPi * (i+colorStep) / 10 ) + 1) / 2)) + ',' 
									+ Math.round(255 * ((Math.sin((twoPi/3) + twoPi * (i+colorStep) / 10 ) + 1) / 2)) + ','
									+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * (i+colorStep) / 10 ) + 1) / 2)) + ')'
							, 
							'rgb(' + Math.round(255 * ((Math.sin((twoPi/3) + twoPi * i / 10 + changeRate * .5 * count) + 1) / 2)) + ',' 
									+ Math.round(255 * ((Math.sin((twoPi * 2/3) + twoPi * i / 10 + changeRate * count) + 1) / 2)) + ','
									+ Math.round(255 * ((Math.sin(twoPi * i / 10 + changeRate * 2 * count) + 1) / 2)) + ')'
							, 
							'rgb(0,0,0)'];
		}
			defs.selectAll('radialGradient')
				 .data(filterData)
				 // Select stops and fill them with data from filterData[i]
				 .selectAll('stop')
				 .data(function(d,i) {
				 	 return d;
				 })
				  .attr('stop-color', function(d) {
				  	return d;
				 });
	   // Update d3 chart with new data.
	   /*radialGrad.selectAll('stop')
	   			 .attr('offset', function(d,i) {
				  	if( i == 0) {
				  		return Math.round(Math.abs(Math.sin(count)) * 90) + '%';
				  	}
				  	else {
				  		return '100%';
				  	}
				  });*/

	   svg.selectAll('circle')
	      .data(frequencyData)
      	  .attr('cx', function(d,i) {
      	  	return midx + 200 * Math.cos(twoPi * i/10 + 2 * count/2 + i/2);
      	  })
		  .attr('cy', function(d,i) {
		  	return midy + 200 * Math.cos(twoPi/2 * i/10);
		  })
	      .attr('r', function(d,i) {
	      	 if (d == 0) {
	      	 	return 0;
	      	 }
	      	 else {
	      	 	return d*1.5;
	      	 }
	      });
	      //.attr('fill', 'url(#radGrad)');
	      /*.attr('fill', function(d,i) {
	   	 return 'rgb(' + Math.round(255 * ((Math.cos(twoPi * i/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((twoPi/3) + twoPi * i/32.0 + 2 * count) + 1)/2)) + ',' 
	   	 			   + Math.round(255 * ((Math.cos((2 * twoPi/3) + twoPi * i/32.0 + 2 * count) + 1)/2)) + ")";
	   });*/
	   count += .01;
	}

	// Run the loop
	renderChart();
});