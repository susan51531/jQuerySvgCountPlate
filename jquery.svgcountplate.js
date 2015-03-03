(function($){
    var XMLNS = 'http://www.w3.org/2000/svg',
        DefaultConf = {
            size: 500,                      //
            radius: 236,                    //
            cx: 250,                        //
            cy: 250,                        //
            outerCircleColor: '#40b12d',    //
            outerCircleWidth: 1,            //
            outerCircleDistance: 20,        //
            cartoonWidth: 36,
            cartoonHeight: 48,
            cartoonAngleSpace: 40,           //
            cartoonStepRatio: 1,            //
            scaleCount: 120,                //
            scaleColor: '#c0c0c0',          //
            scaleLength: 20,                //
            maxNum: 100                     //
        };

    function genRect(count,cx,cy,radius,outerCircleDistance,scaleLength,groupContainer) {
        var polygon,
            d = 2 * Math.PI/count/2,
            rad = Math.PI / 2,
            innerRadius,
            outerRadius,
            cosVal,
            sinVal,
            poly,
            i;

        outerRadius = radius - outerCircleDistance;
        innerRadius = outerRadius - scaleLength;
        for(i=0; i< count; i++){
            poly = [0,',',0,' ',0,',',0,' ',0,',',0,' ',0,',',0];
            cosVal = Math.cos(rad);
            sinVal = Math.sin(rad);
            poly[0] = cx + innerRadius*cosVal;
            poly[2] = cy - innerRadius*sinVal;

            poly[4] = cx + outerRadius*cosVal;
            poly[6] = cy - outerRadius*sinVal;

            rad -= d;
            cosVal = Math.cos(rad);
            sinVal = Math.sin(rad);

            poly[8] = cx + outerRadius*cosVal;
            poly[10] = cy - outerRadius*sinVal;
            
            poly[12] = cx + innerRadius*cosVal;
            poly[14] = cy - innerRadius*sinVal;

            polygon = document.createElementNS(XMLNS,'polygon');
            polygon.setAttribute('stroke-width','0');
            polygon.setAttribute('fill','#c0c0c0');
            polygon.setAttribute('points',poly.join(''));
            groupContainer.appendChild(polygon);
            rad -= d;
        }
    }

    function apllyProgress(start,end,normalColor,hilightColor,group) {
        var rectList = group.children||group.childNodes,
            i,length = rectList.length;
        for(i=0; i< length; i++) {
            if(i>=start && i<=end){
                rectList[i].setAttribute('fill', hilightColor);
            } else {
                rectList[i].setAttribute('fill', normalColor);
            }
        }
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = angleInDegrees * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY - (radius * Math.sin(angleInRadians))
      };
    }

    function genArc(x, y, radius, startAngle, endAngle){

        var start = polarToCartesian(x, y, radius, startAngle);
        var end = polarToCartesian(x, y, radius, endAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, arcSweep, 1, end.x, end.y
        ].join(" ");

        return d;
    }
    
    $.fn.svgCountPlate = function(option){
        var config = $.extend({}, DefaultConf, option)
        return $(this).each(function(){
            var $this = $(this),
                plate = $this.data('_svgCountPlate'),
                svg,
                outerGroup,
                scaleGroup,
                circle,
                cartoon,
                cartoonStep = 360/config.scaleCount*config.cartoonStepRatio;

            if(!plate) {
                svg = document.createElementNS(XMLNS,'svg');
                svg.setAttribute('xmlns', XMLNS);
                svg.setAttribute('width', config.size);
                svg.setAttribute('height', config.size);

                outerGroup = document.createElementNS(XMLNS, 'g');
                circle = document.createElementNS(XMLNS, 'path');
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', config.outerCircleColor);
                circle.setAttribute('stroke-width', config.outerCircleWidth);
                circle.setAttribute("d", 
                    genArc(config.cx, config.cy, config.radius, 
                        90 - config.outerCircleDistance/2,
                        360 + 90 + config.outerCircleDistance/2));

                cartoon = document.createElementNS(XMLNS, 'path');
                cartoon.setAttribute("d", "M30.862,37.162c0.11-3.077-6.885-10.067-6.885-10.067 c-1.44-2.76-1.212-5.641-1.212-5.641c0.039-7.364,1.605-4.561,1.605-4.561c0.278,2.341,2.332,5.62,2.332,5.62 c2.394,3.632,3.396,2.203,3.396,2.203c0.722-1.379-0.615-3.387-0.615-3.387c-2.363-2.626-3.489-7.865-3.489-7.865 c-0.603-2.654-1.735-3.366-1.735-3.366s-0.946-1.115-2.293-1.09c-2.178,0.04-5.452,0.045-7.662,0.142 c-1.402,0.061-2.351,1.742-2.351,1.742c-3.259,6.128-3.705,13.095-3.705,13.095c0.129,2.212,1.64,1.632,2.248,0.525 c0.506-0.921,0.532-1.709,0.532-1.709c2.304-10.723,2.724-4.581,2.724-4.581c-0.195,4.54,0.505,6.383,0.671,6.784 c1.307,1.67,9.096,8.327,9.096,8.327C31.073,40.232,30.862,37.162,30.862,37.162z M13.911,27.847c-1.27,0.59-6.56,9.75-6.56,9.75 c-0.215,1.541,1.689,0.535,1.689,0.535c1.113-0.425,8.285-6.95,8.285-6.95C17.348,27.703,13.911,27.847,13.911,27.847z M18.353,8.509c2.628-0.049,4.723-2.243,4.679-4.901c-0.044-2.658-2.209-4.773-4.837-4.724s-4.723,2.243-4.679,4.901 C13.56,6.442,15.726,8.558,18.353,8.509z");
                cartoon.setAttribute("style", "fill-rule:evenodd;clip-rule:evenodd;fill:" + (config.cartoonColor ? config.cartoonColor:config.outerCircleColor)+ ";");
                cartoon.setAttribute("transform", "translate(" + (config.cx -config.cartoonWidth/2) + "," + (config.cy - config.radius - config.cartoonHeight/2)+ ")");

                outerGroup.appendChild(circle);
                outerGroup.appendChild(cartoon);
                svg.appendChild(outerGroup);

                outerGroup.setAttribute("transform", "rotate(-" +cartoonStep +" " + config.cx + " " + config.cy+")");
                scaleGroup = document.createElementNS(XMLNS, 'g');
                genRect(config.scaleCount, config.cx, config.cy, config.radius, config.outerCircleDistance, config.scaleLength, scaleGroup);

                svg.appendChild(scaleGroup);

                $this.append(svg);

                plate = {
                    update: function(progress){
                        var progress =progress <= config.maxNum? progress:progress % config.maxNum,
                            progressedScaleCount = progress !== config.maxNum ? Math.floor(progress/config.maxNum*config.scaleCount):config.scaleCount,
                            scaleDeg = 360/config.scaleCount;

                        apllyProgress(0, 
                            progressedScaleCount,
                            config.scaleColor,
                            config.scaleHilighColor ?config.scaleHilighColor:config.outerCircleColor,
                            scaleGroup);
                        outerGroup.setAttribute("transform","rotate(" + (progressedScaleCount *scaleDeg - cartoonStep) +" " + config.cx + " " + config.cy+ ")");
                    }
                };
                $this.data('_svgCountPlate', plate);
            }

            if(config.hasOwnProperty('progress')){

                plate.update(config.progress);
            }

        });
    }

})(jQuery);
