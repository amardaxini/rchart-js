function Rchart(id, data)
{


    this.id                = id;
    this.canvas            = document.getElementById(id);
    this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
    this.data              = data;
    this.initializeValue  = this.initializeValue();
    this.charts = {'bar':'bar','line':'line','pie':'pie'};
    this.gAreaX1 = 0;
    this.gAreaX2 = 0;
    this.gAreaY1 = 0;
    this.gAreaY2 = 0;
    //SCALE
    this.gCenterX = 0;
    this.gCentery = 0;
    this.vMin;
    this.vMax;
    this.vXMin;
    this.vXMax;
    this.xDivisions=0;
    this.divisions = 0;
    this.divisionCount = 0;
    this.divisionHeight= 0;
    this.xDivisionRatio= 0;
    this.xDivisionCount= 0;
    this.xDivisionHeight= 0;
    this.dataCount = 0;
    this.fontSize= 10;
    this.text= new Text({});
    this.self=this;
    this._intID = 0;
    this.minHeight = 10;
    // The Following is Data for Pie Chart
    this.startAngle = 270;
    this.maxWidth = 10; 
    this.pieRotation = false
    this.pieRadius = this.getRadius();
    this.pieOffset = 0;
    this.fontSize = 8;
    this.fontColor = "#666666";
    this.fontFamily = "san-serif";
    // this.drawGraph(this.data);
    // ADD RDATA/RCHART Default values or required parameter
}



Rchart.fn = Rchart.prototype;
function swap_no(array_el)
{
    var temp = array_el[0];
    array_el[0] = array_el[1];
    array_el[1] =temp;
    return array_el;
}
//set boundry of graph
Rchart.fn.setGraphArea = function(x1,y1,x2,y2)
{
    this.gAreaX1 = x1;
    this.gAreaY1 = y1;
    this.gAreaX2 = x2;
    this.gAreaY2 = y2;
};

// ADD MORE OPTION LIKE GRADIENT PALLETE/OR MORE OPTION TO DRAW
// GRADIENT BACKGROUND OF IMAGE etc..
Rchart.fn.getRadius = function()
{
  var minValue =  min(this.canvas.width,this.canvas.height);    
  // taking the radius in ratio of 4 : 1 of the minValue
  var radius = parseInt(minValue/4);
  return radius;
}
//draw line  paassing starting coordinate (x1,y1) and ending coordinate (x2,y2)
Rchart.fn.drawLine = function(x1, y1, x2, y2, color,width)
{
    // color = typeof(color) != 'undefined' ? color : "#000000";


    if(typeof(color) != 'undefined')
    {
        //this.context.strokeStyle = color;
        this.context.strokeStyle = color;
        this.context.strokeStyle = ''
    }
    if(typeof(width) != 'undefined')
    {
        this.context.lineWidth=width;

    }

    this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    this.context.stroke();



};
Rchart.fn.drawDottedLine = function(x1,y1,x2,y2,dotSize,color,width)
{
    this.context.dashedLineTo(x1,y1,x2,y2,dotSize);
    if(typeof(color) != 'undefined')
    {
        //this.context.strokeStyle = color;
        this.context.strokeStyle = color;
        this.context.strokeStyle = ''
    }
    if(typeof(width) != 'undefined')
    {
        this.context.lineWidth=width;
    }
    this.context.stroke();

};
// Drawing rectangle starting coordinate (x1,y1) and ending coordinate (x2,y2)
// rectangel can be drawn 2 ways by actual canvas method rect or
// by drawing line with changing coordinate
Rchart.fn.drawRectangle = function(x1, y1, x2, y2, color)
{
    //color = typeof(color) != 'undefined' ? color : "#000000";
    if(typeof(color)!='undefined')
        this.context.fillStyle = color;
    x1=x1-0.2;
    y1=y1-0.2;
    x2=x2+0.2;
    y2=y2+0.2;

    this.context.moveTo(x1,y1);
    var  width = x2-x1;
    var height =y2-y1;
    this.context.rect(x1,y1,width,height);
    //Or Use This Check

    //    this.drawLine(x1,y1,x2,y1,color);
    //    this.drawLine(x2,y1,x2,y2,color);
    //    this.drawLine(x2,y2,x1,y2,color);
    //    this.drawLine(x1,y2,x1,y1,color);
};
// Drawing filled rectangle with starting coordinate (x1,y1) and ending coordinate (x2,y2)
// passing color which fills color and
// passing border as boolean whether to draw or not
// check border is printed or not
Rchart.fn.drawFilledRectangle = function(x1, y1, x2, y2, color,border)
{
    // color = typeof(color) != 'undefined' ? color : "#000000";
    border = typeof(border) != 'undefined' ? border : true;
    if(typeof(color)!='undefined')
        this.context.fillStyle = color;
    // Swapping variable if negative value
    // TODO check whether swapping is required or not
    if(x2 < x1)
    {
        var s = swap_no([x1,x2]);
        x1 = s[0];
        x2 = s[1];
    }
    if(y2<y1)
    {
        var s = swap_no([y1,y2]);
        y1 = s[0];
        y2 = s[1];
    }
    this.context.moveTo(x1,y1);
    var  width = Math.abs(x2-x1)+2;
    var  height =Math.abs(y2-y1)+2;
    //Calculating width and height and draw fill rectangle with passed color
    this.context.fillRect(x1,y1,width,height);

    if(border)
    {
        this.drawRectangle(x1,y1,x2,y2,color)
    }
};
//Drawing just rounded rectangle
Rchart.fn.roundedRectangle = function(x1,y1,width,height,radius){
    this.context.beginPath();
    //ASSUMING NORMAL SCENARIO X2>x1 and y2>y1
    // It will work for all rectangle cooardinate
    //Draw First Vertical Line with  spacing top and bottom upto given radius
    this.context.moveTo(x1,y1+radius);
    this.context.lineTo(x1,y1+height-radius);
    //Drawing Curve  Bottom most left curve
    this.context.quadraticCurveTo(x1,y1+height,x1+radius,y1+height);
    //Drawing Bottom line
    this.context.lineTo(x1+width-radius,y1+height);
    //Drawing Bottom curve
    this.context.quadraticCurveTo(x1+width,y1+height,x1+width,y1+height-radius);
    // Drawing right vertical line
    this.context.lineTo(x1+width,y1+radius);
    // Drawing top right curvw
    this.context.quadraticCurveTo(x1+width,y1,x1+width-radius,y1);
    // Drawing top line
    this.context.lineTo(x1+radius,y1);
    // Drawing top left curve
    this.context.quadraticCurveTo(x1,y1,x1,y1+radius);
};
// Drawing rounded rectangle with starting coordinate (x1,y1) and ending coordinate (x2,y2)
// Passing radius for rounded corner by default is 5px
// it will draw and rounded corener rectangle by manipulating radius
Rchart.fn.drawRoundedRectangle = function(x1, y1, x2, y2, radius,color)
{
    color = typeof(color) != 'undefined' ? color : "#000000";
    radius = typeof(radius) != 'undefined' ? radius : 5;
    this.context.strokeStyle = color;
    var  width = x2-x1;
    var height = y2-y1;
    this.roundedRectangle(x1,y1,width,height,radius);
    this.context.stroke();
};

Rchart.fn.drawFilledRoundedRectangle = function(x1, y1, x2, y2, radius,color)
{
    color = typeof(color) != 'undefined' ? color : "#000000";
    radius = typeof(radius) != 'undefined' ? radius : 5;
    this.context.fillStyle = color;
    var  width = x2-x1;
    var height = y2-y1;
    // console.log(x1);
    this.roundedRectangle(x1,y1,width,height,radius);
    this.context.fill();
};

Rchart.fn.drawGraphArea = function(color,stripe)
{
    stripe = typeof(stripe) != 'undefined' ? stripe : false;
    var colorDec = new RGBColor(color).getDecimalVals();
    var decStr = new String();
    var r = colorDec.red;
    var r1 = r-40;
    var g = colorDec.green;
    var g1 = g-40;
    var b = colorDec.blue;
    var b1 = b-40;
    decStr = "rgb("+r1+","+g1+","+b1+")";
    var colorHex = new RGBColor(decStr).getHexVals();
    this.drawFilledRectangle(this.gAreaX1,this.gAreaY1,this.gAreaX2,this.gAreaY2,color,false);
    this.drawRectangle(this.gAreaX1,this.gAreaY1,this.gAreaX2,this.gAreaY2,colorHex);
    if(stripe)
    {
        var	r2 = r-15;
        if(r2<0) r2 = 0;
        var g2 = r-15;
        if(g2 < 0) g2 = 0;
        var b2 = r-15;
        if (b2 < 0) b2 = 0;
        var lineDecColor = new String();
        lineDecColor = "rgb("+r2+","+g2+","+""+b2+")";
        var lineHexColor = new RGBColor(lineDecColor).getHexVals(lineDecColor);
        var skewWidth = this.gAreaY2-this.gAreaY1-1;
        var i =this.gAreaX1-skewWidth;
        console.log(i);
        while(parseFloat(i)<=parseFloat(this.gAreaX2))
        {
            var x1 = i;
            var y1 = this.gAreaY2;
            var x2 = i+skewWidth;
            var y2 = this.gAreaY1;
            if(x1 < this.gAreaX1)
            {
                x1 = this.gAreaX1;
                y1 = this.gAreaY1 + x2 - this.gAreaX1 + 1;
            }
            if ( x2 >= this.gAreaX2 )
            {
                y2 = this.gAreaY1 + x2 - this.gAreaX2 +1;
                x2 = this.gAreaX2 - 1;
            }
            //      this.context.beginPath();
            this.drawLine(x1,y1,x2,y2+1,lineHexColor);
            i = i+4;
        }
    }


};
Rchart.fn.drawGrid = function(lineWidth,color,dotted,vertical)
{

    dotted = typeof(dotted) != 'undefined' ? dotted : false;
    vertical = typeof(vertical) != 'undefined' ? vertical : true;
    //    if (mosaic)
    //    {
    //        //var width  = this.gAreaX2-this.gAreaX1;
    //        //this.context.beginPath();
    //       // this.drawFilledRectangle(0,0,this.gAreaX2,this.gAreaY2,color);
    //        var yPos  = this.gAreaY2;//-this.gAreaY1;
    //        var lastY = yPos;
    //        i=0;
    //
    //        while(i<=this.divisionCount)
    //        {
    //            lastY=  yPos;
    //            yPos  =  yPos - this.divisionHeight;
    //            if(yPos <= 0 )
    //                yPos = 1;
    //            if ( i % 2 == 0 )
    //            {
    //                this.drawFilledRectangle(this.gAreaX1+1,yPos,this.gAreaX2,lastY,"rgb(250,250,250)");
    //            }
    //            i = i+1;
    //        }
    //
    //
    //    }
    //Horizontal lines
    yPos = this.gAreaY2 - this.divisionHeight;
    var i=1;


    while(i<=this.divisionCount)
    {

        if ( Math.floor(yPos) > this.gAreaY1 && Math.floor(yPos) < this.gAreaY2 )
        {
            this.context.beginPath();
            if(dotted)
                this.drawDottedLine(this.gAreaX1,yPos,this.gAreaX2,yPos,4,color,1);
            else
                this.drawLine(this.gAreaX1,yPos,this.gAreaX2,yPos,color,1);
        }
        yPos = yPos - this.divisionHeight;
        i = i+1;
    }
    // Vertical lines
    if(vertical)
    {
        if (this.gAreaXOffset == 0 )
        {
            var xPos = this.gAreaX1 + (this.divisionWidth) +this.gAreaXOffset;
            var colCount = Math.floor(parseFloat(this.dataCount)-2);
        }
        else
        {
            var xPos = this.gAreaX1 +this.gAreaXOffset;
            var colCount = ( (this.gAreaX2 - this.gAreaX1) / this.divisionWidth );
        }
        i= 1;
        while (i<=colCount)
        {
            if ( xPos > this.gAreaX1 && xPos < this.gAreaX2 )
            {
                this.context.beginPath();
                if(dotted)
                    this.drawDottedLine(Math.floor(xPos),this.gAreaY1,Math.floor(xPos),this.gAreaY2,4,color,lineWidth);
                else
                    this.drawLine(Math.floor(xPos),this.gAreaY1,Math.floor(xPos),this.gAreaY2,color,lineWidth);
            }
            xPos = xPos + this.divisionWidth;

            i= i+1
        }
    }
};
Rchart.fn.setFixedScale = function(vMin,vMax,divisions,vXMin,vXMax,xDivisions)
{
    divisions = typeof(divisions) != 'undefined' ? divisions : 5;
    vXMin = typeof(vXMin) != 'undefined' ? vXMin : 0;
    vXMax = typeof(vXMax) != 'undefined' ? vXMax : 0;
    xDivisions = typeof(xDivisions) != 'undefined' ? xDivisions : 0;
    this.vMin      = parseFloat(vMin);
    this.vMax      =parseFloat(vMax);
    this.divisions = parseFloat(divisions);

    if (vXMin != 0)
    {
        this.vXMin      = parseFloat(vXMin);
        this.vXMax      = parseFloat(vXMax);
        this.xDivisions = parseFloat(xDivisions);
    }

};
//MODE
// SCALE_NORMAL = 1
// SCALE_ADDALL = 2
// SCALE_START0 = 3
// SCALE_ADDALLSTART0 = 4
//data is  ["series1","series2"]
//align ="center"
//draw_ticks=true,angle=0,decimals=1,with_margin=false,skip_labels=1,right_scale=false
Rchart.fn.drawScale = function(data,mode,color,drawTicks,align,decimals,margin,skipLabel,rightScale,font,fontSize){
    drawTicks = typeof(drawTicks) != 'undefined' ? drawTicks : true;
    align  = typeof(angle) != 'undefined' ? align : "left";
    decimals=typeof(decimals) != 'undefined' ? decimals : 1;
    margin=typeof(margin) != 'undefined' ? margin : false;
    skipLabel=typeof(skipLabel) != 'undefined' ? skipLabel : 1;
    rightScale=typeof(rightScale) != 'undefined' ? rightScale : false;
    font=typeof(font) != 'undefined' ? font : "Arial";
    fontSize=typeof(fontSize) != 'undefined' ? fontSize : 8;
    var scale = 0;
    var divisions = 0;
    var dataLength = 0;
    this.context.beginPath();

    this.drawLine(this.gAreaX1,this.gAreaY1,this.gAreaX1,this.gAreaY2,color);

    this.drawLine(this.gAreaX1,this.gAreaY2,this.gAreaX2,this.gAreaY2,color);
    //Calculate Minimum And Maximum Value from Array of data
    //set default value of vertical min,and vertical maximum

    if(this.vMin == null && this.vMax == null)
    {
        //var defaultSeriesValue =this.findSeriesValues(data[0])[0];
        if((this.findSeriesValues(data[0]) != 'undefined') && (this.findSeriesValues(data[0])[0] != 'undefined'))
        {

            this.vMin =this.findSeriesValues(data[0])[0];
            this.vMax =this.findSeriesValues(data[0])[0];
        }
        else
        {
            this.vMin = 2147483647;
            this.vMax= -2147483647;
        }

        if(mode==1 || mode==3)
        {
            if (mode == 3 )
                this.vMin = 0;

            //Traverse ALl Series find out maximum and minimum value so we can draw scale
            for(var i=0;i<data.length;i++)
            {
                //Find Out max and min value across all series

                if((this.findSeriesValues(data[i]) != 'undefined'))
                {
                    var values = this.findSeriesValues(data[i]);
                    if(dataLength < values.length)
                        dataLength =  values.length;
                    if(this.vMax < values.max())
                        this.vMax = values.max();
                    if(this.vMin > values.min())
                        this.vMin = values.min();

                }
            }

        }
        else if(mode==2 || mode==4)
        {
            if (mode == 4 )
                this.vMin = 0;
            var seriesData= [];
            var length=0;
            for(i=0;i<data.length;i++)
            {
                //add all data to one array
                //[1,2,3],[4,5,0] max min of summation of each index

                if((this.findSeriesValues(data[i]) != 'undefined'))
                {
                    if(length<this.findSeriesValues(data[i]).length)
                    {
                        length =this.findSeriesValues(data[i]).length;
                        dataLength = length;
                    }
                    seriesData[i] =this.findSeriesValues(data[i]);

                }
            }

            for(i=0;i<length;i++)
            {
                var sum=0;
                for(var j=0;j<seriesData.length;j++)
                {

                    if(typeof(seriesData[j][i])=="number")
                        sum  += seriesData[j][i];
                }
                if(this.vMax < sum)
                    this.vMax = sum;
                if(this.vMin > sum)
                    this.vMin = sum
            }

        }
        if(this.vMax==this.vMin)
            if ( this.vMax >= 0 )
                this.vMax = this.vMax+1;
            else
                this.vMin = this.vMin-1;

        //Compute automatic scaling
        var scaleOk = false;
        var factor = 1;
        var minDivHeight = 25;
        var maxDivs = parseFloat((this.gAreaY2 -this.gAreaY1))/minDivHeight;
        if (this.vMin==0 && this.vMax==0 )
        {
            this.vMin = 0;
            this.vMax = 2;
            scale = 1;
            divisions = 2;
        }
        else if(maxDivs > 1)
        {
            while(!scaleOk)
            {
                var scale1 = parseFloat((this.vMax - this.vMin ))/ factor;
                var  scale2 = parseFloat((this.vMax - this.vMin ))/factor / 2;
                if ( scale1 > 1 && scale1 <= maxDivs && !scaleOk)
                {
                    scaleOk = true;
                    divisions = Math.floor(scale1);
                    scale = 1;
                }
                if(scale2 > 1 && scale2 <= maxDivs && !scaleOk)
                {
                    scaleOk = true;
                    divisions = Math.floor(scale2);
                    scale = 2
                }
                if (!scaleOk)
                {
                    if ( scale2 > 1 )
                        factor = factor * 10;
                    if ( scale2 < 1 )
                        factor = factor / 10;
                }
            }
            if (Math.floor((((parseFloat(this.vMax) / scale) / factor))) != ((parseFloat(this.vMax) / scale) / factor))
            {
                var grid_id     = Math.floor((parseFloat(this.vMax) / scale / factor))+ 1;
                this.vMax       = grid_id * scale * factor;
                divisions       = divisions+1;
            }

            if (((parseFloat(this.vMin) / scale) / factor).floor != ((parseFloat(this.vMin) / scale) / factor))
            {
                var grid_id     = Math.floor((parseFloat(this.vMin)/ scale / factor));
                this.vMin       = grid_id * scale * factor;
                divisions       = divisions+1;
            }
        }
        else{
            scale=1;
        }
        if ( divisions == 0 )
            divisions = 2;
        if (scale == 1 && divisions%2 == 1)
            divisions = divisions-1
    }
    else{
        divisions = this.divisions
    }


    this.divisionCount =divisions;
    //Now Find Out Data Range
    var dataRange = this.vMax - this.vMin;
    if (dataRange == 0 )
        dataRange = 0.1;
    this.divisionHeight = parseFloat(this.gAreaY2 - this.gAreaY1 ) / divisions;
    this.divisionRatio  = parseFloat(this.gAreaY2 - this.gAreaY1 ) /dataRange;
    this.gAreaXOffset  = 0;

    if (dataLength > 1 )
    {
        if (!margin)
            this.divisionWidth = parseFloat(this.gAreaX2 - this.gAreaX1 )/(dataLength-1);
        else
        {
            this.divisionWidth = parseFloat(this.gAreaX2 - this.gAreaX1 )/(dataLength);
            this.gAreaXOffset  = parseFloat(this.divisionWidth) / 2;
        }
    }
    else
    {
        this.divisionWidth =parseFloat(this.gAreaX2 - this.gAreaX1);
        this.gAreaXOffset  =parseFloat(this.divisionWidth)/2;
    }
    this.dataCount = dataLength;

    if (!drawTicks)
        return;
    var yPos = this.gAreaY2;
    var xMin = 0;
    var i =1;
    while(i<= divisions+1)
    {
        this.context.beginPath();
        //Draw Ticks
        if (rightScale )
            this.drawLine(this.gAreaX2,yPos,this.gAreaX2+5,yPos,color);
        else
            this.drawLine(this.gAreaX1,yPos,this.gAreaX1-5,yPos,color);
        //Write Value Maybe No Or some label
        // Currently No
        var value     = this.vMin + (i-1) * (( this.vMax - this.vMin ) / divisions);
        value     = roundOf((value * Math.pow(10,decimals)),0) / (Math.pow(10,decimals));
        var width=this.textWidth({"x":this.gAreaX1,"y":yPos,"text":value,"fontSize":fontSize,"font":font,"color":color});
        var height = fontSize;
        if(Math.floor(value) == Math.ceil(value))
            value= Math.round(value);
        if (rightScale)
        {

            //image_ttf_text(@picture,@font_size,0,this.gAreaX2+10,yPos+(@font_size/2),c_text_color,@font_name,value)
            this.drawText({"x":this.gAreaX2+10,"y":yPos+(fontSize/2),"text":value,"fontSize":fontSize,"font":font,"color":color});
            if (xMin==0 || xMin < this.gAreaX2+15+width)
                xMin = this.gAreaX2+15+width;
        }
        else
        {
            this.drawText({"x":this.gAreaX1-width,"y":yPos+(fontSize/2),"text":value,"fontSize":fontSize,"font":font,"color":color});
            //image_ttf_text(@picture,@font_size,0,this.gAreaX1-10-text_width,yPos+(@font_size/2),c_text_color,@font_name,value)
            if (xMin==0 || xMin > this.gAreaX1-width)
                xMin = this.gAreaX1-width;
        }
        yPos = yPos - this.divisionHeight;
        i = i+1
    }
    var xPos = this.gAreaX1 + this.gAreaXOffset;
    var id = 1;
    var yMax =0;


    if(typeof(this.data["xLabelSeries"])!="undefined")
    {
        var xLabelSeries = this.findSeriesValues(this.data["xLabelSeries"]);
    }
    else
    {

        var xLabelSeries = [];
        for(var i=0;i<this.findSeriesValues(data[0]).length;i++)
        {

            xLabelSeries[i]=i;
        }
    }

    for(var i=0;i<xLabelSeries.length;i++)
    {
        if ( id % skipLabel == 0 )
            this.drawLine(xPos,this.gAreaY2,xPos,this.gAreaY2+5,color);
        value =xLabelSeries[i];
        yPos= this.gAreaY2+18;
        this.drawText({"x":Math.floor(xPos)-(width/2),"y":yPos,"text":value,"fontSize":fontSize,"font":font,"color":color,"align":align});
        xPos = xPos + this.divisionWidth;
        id = id+1
    }
    //Draw Yaxis name
    var yAxis=this.data["axis"]["y"];
    if(yAxis!= 'undefined')
    {
        var textHeight =   typeof(yAxis["fontSize"]) != 'undefined' ? yAxis["fontSize"] : 10;
        var textTop    = ((this.gAreaY2 - this.gAreaY1) / 2) +this.gAreaY1 + (textHeight/2);
        var textOptions={};

        textOptions= textOptions.merge(yAxis["value"]);

        // console.log(xMin-textHeight);
        if (rightScale)
        {

            textOptions=textOptions.merge({"x":xMin+textHeight,"y":textTop,"angle":90});
            //      this.drawText(textOptions);
        }
        else
        {
            textOptions=textOptions.merge({"x":xMin+(textHeight/2),"y":textTop,"angle":90});
            //     this.drawText(textOptions);
        }
    }

};
Rchart.fn.initializeValue = function()
{
    // this.data = jQuery.parseJSON(this.data);
};


Rchart.fn.logger = function(msg) {
    console.log(msg);
};
Rchart.fn.setBackGroundImage = function(src) {
    var image = new Image();

    image.src = src;
    console.log(src);
    this.context.drawImage(image,0,0);
};
Rchart.fn.getValue = function(key,value)
{
    value= typeof(value) != 'undefined' ? value : "undefined";
    return this.data[key][value] != 'undefined' ?  this.data[key][value] : "undefined";
};
Rchart.fn.graphWidth = function(){
    return Math.abs(this.gAreaX2 - this.gAreaX1);

};
Rchart.fn.graphHeight = function(){
    return Math.abs(this.gAreaY2 - this.gAreaY1);
};
//Return pixel width
Rchart.fn.textWidth =function(options){
    if(typeof(options)!='undefined')
        var text =  new Text(options);
    else
        var text = new Text({});
    this.context.font= text.fontSize+"pt "+text.font;
    // console.log(this.context.measureText(text.text).width);
    return this.context.measureText(text.text).width;
};
Rchart.fn.deg2Rad = function(angle){
    return (angle*Math.PI/180);
};
//text options as follows
// {"x":10,"y":0,"text":"aaa","fontSize":"10","font":"Arial",align":"",stroke":true,"strokeColor":"#000000","lineWidth":1,"angle":0}
Rchart.fn.drawText = function(options){
    if(typeof(options)!='undefined')
        var text =  new Text(options);
    else
        var text = new Text({});

    var angle = typeof(options["angle"])!="undefined" ? this.deg2Rad(options["angle"]-180) : 0;
    if(angle!=0)
    {

        var length =this.textWidth(text);
        if(angle<=90)
        {
            this.context.save();
            this.context.translate(-(text.x*2),text.y);
            this.context.rotate(angle);
        }
    }
    this.context.font= text.fontSize+"pt "+text.font;


    this.context.fillStyle = text.color;
    this.context.textAlign = text.align;

    if(text.stroke)
    {
        this.context.strokeStyle=text.strokeColor; // stroke color
        this.context.strokeText(text.text, text.x, text.y);
    }
    else{
        this.context.fillText(text.text, text.x, text.y);

    }
    this.context.restore();

};

Rchart.fn.drawTitle= function(x_pos,yPos,value,r,g,b,x_pos2,yPos2,shadow)
{
    //set default value
    x_pos2 = typeof(x_pos2) != 'undefined' ? x_pos2 : -1;
    yPos2 = typeof(yPos2) != 'undefined' ? yPos2 : -1;
    shadow = typeof(shadow) != 'undefined' ? yPos2 : false;
};
Rchart.fn.calculateLabels = function(values){
    var labels = [];
    //values = Array of values
    var width = this.graphWidth();
    var length = values.length;
    //NEED to think whether label is no or not
    for(var i=0;i<length;i++)
    {

    }
};

Rchart.fn.findSeriesValues= function(name,key)
{
    var values;
    key = typeof(key) != 'undefined' ? key : "value";
    for(var i=0 ;i<this.data["series"].length;i++)
    {

        if(this.data["series"][i]["name"] == name)
        {
            values = this.data["series"][i][key];
            break;
        }
    }
    return values;
};


// PIE Chart Graph


Rchart.fn.drawPieGraph = function() {
    var pieSeries = this.data["graph"]["pie"]["values"];
    // data of pieSeries
    var pieSeriesValue = this.findSeriesValues(pieSeries);
    
    var fontData = this.findSeriesValues(pieSeries,"font") 
   
    this.fontSize = typeof(fontData["size"]) == "undefined" ? this.fontSize : parseInt(fontData["size"]);
    
    this.fontFamily = typeof(fontData["family"]) == "undefined" ? this.fontFamily : fontData["family"];
    
    this.fontColor = typeof(fontData["color"]) == "undefined" ? this.fontColor : fontData["color"];
    
    // color for pie series section   
    var pieSeriesColor = this.findSeriesValues(pieSeries,"color");
   
    // The Amount the degree the Pie Should be shifted from starting point
    var pieOffset = this.findSeriesValues(pieSeries,"offset");
    // rotation of the pie Series in clockwise and anticlockwise 
    // TODO
    // need to be removed
   // var pieRotation = this.findSeriesValues(pieSeries,"rotation");
    this.minHeight = this.setMinHeight();     

    var pieLegend =  this.findSeriesValues(pieSeries,"legend");

    // radius of the pie Circle that need to be drawn
    var pieRadius =  this.findSeriesValues(pieSeries,"radius");
   
    var background = this.findSeriesValues(pieSeries,"background"); 
    // default pie off set is set to -30
    this.pieOffset = typeof(pieOffset) == "undefined" ? this.pieOffset : pieOffset;


   // var pieRotation = typeof(pieRotation) == "undefined" ? false : pieRotation;

    var pieLegend =   typeof(pieLegend) == "undefined" ? false : pieLegend;
    // set pieRadius if not set
    this.pieRadius = typeof(pieRadius) == "undefined" ? this.pieRadius : pieRadius;
    // check whether the data is a percent of not get the percent
    
    var total  =  this.pieTotal(pieSeriesValue);
    
    if (background) {
      this.setGraphArea(0,0,this.canvas.width,this.canvas.height);
      this.drawGraphArea("rgb(255,255,255)",true);
    }  
    this.findCenter(this.canvas.width,this.canvas.height)
    this.startAngle +=  this.pieOffset;
    var startAngle = this.startAngle;
     
    this.drawPie(pieSeriesValue,pieSeriesColor,startAngle,this.startAngle,total); 
    this.drawPieLabel(pieSeriesValue,startAngle,this.startAngle,total)
   

};

Rchart.fn.drawPie = function(data,colors,startAngle,finalAngle,total) {
  
   for (var i=0;i < data.length; i++) { 
    if (i!= data.length-1) 
      var endAngle = startAngle + (data[i]/total)*360;
    else   
      var endAngle = finalAngle;
   this.drawArc(colors[i],startAngle,endAngle);  
   startAngle = endAngle;      
  }
}   

Rchart.fn.drawArc = function(color,startAngle,endAngle) {
   
    this.context.beginPath();
    this.context.moveTo(this.gCenterX,this.gCenterY);
    this.context.fillStyle = color;
    this.context.arc(this.gCenterX,this.gCenterY,this.pieRadius,(Math.PI/180)*startAngle,(Math.PI/180)*endAngle,this.pieRotation);
    this.context.fill();   
}


Rchart.fn.drawPieLabel = function(data,startAngle,finalAngle,total) {
   var previousY = 0;
   
   var previousAngle = 0;
   // labels of the pie chart 
   var tickRadius = this.pietickRadius();
   // the Radius of the Tick Draw for center of each sector of the arc
   var labelRadius = this.labelRadius();
   // label Radius
   var pieSeries = this.data["graph"]["pie"]["values"];
   
   var pieLabels  = this.findSeriesValues(pieSeries,"label");
   
   for (var i=0;i < data.length; i++) { 
     if (i!= data.length-1) 
       var endAngle = startAngle + (data[i]/total)*360;
     else   
       var endAngle = finalAngle;  
       
    var arcCenter = this.arcCenterAngle(startAngle,endAngle);
    
    var tickXYinitial = this.tickXY(this.gCenterX,this.gCenterY,this.pieRadius,arcCenter);
    
    
    
    var tickXYfinal = this.tickXYendpt(tickXYinitial[0],tickXYinitial[1],tickRadius,arcCenter);
        
    this.drawpieTick(tickXYinitial[0],tickXYinitial[1],tickXYfinal[0],tickXYfinal[1]);
    
    previousY = this.drawLabel(arcCenter,tickXYfinal[0],tickXYfinal[1],previousY,previousAngle,pieLabels[i],labelRadius);    
    
    previousAngle = arcCenter;
    
    startAngle = endAngle;
    }
}

Rchart.fn.setMinHeight = function() {
  return parseInt(this.fontSize) + 2

}

Rchart.fn.arcCenterAngle = function(startAngle,endAngle) {
    if (startAngle >= endAngle) 
      var temp  = 360 - startAngle;
    else 
      var temp = startAngle;    
      
    var angleBisectAt = (temp+endAngle)/2 ;
    
    angleBisectAt  = (startAngle >= endAngle) ? ((angleBisectAt+startAngle) >= 360  ? ((angleBisectAt +startAngle) - 360) : (angleBisectAt + startAngle)) : angleBisectAt;    
    
    return angleBisectAt;
}

Rchart.fn.tickXY = function(X,Y,radius,centerAngle) {
   return [(X + radius*(Math.cos((Math.PI/180)*centerAngle))),(Y + radius*(Math.sin((Math.PI/180)*centerAngle)))];
}

Rchart.fn.tickXYendpt = function(X,Y,radius,centerAngle) {
  var tickendptcoordinate = this.tickXY(X,Y,radius,centerAngle)
  return tickendptcoordinate;
}

Rchart.fn.pietickRadius = function() {
  return parseInt(this.pieRadius * 0.15);
}
Rchart.fn.drawpieTick = function(X,Y,X1,Y1) {
   this.context.beginPath();
   this.context.moveTo(X,Y);
   this.context.lineTo(X1,Y1);
   this.context.strokeStyle = "#000000";
   this.context.stroke();
}


Rchart.fn.drawLabel = function(arcCenter,X,Y,previousY,previousAngle,text,labelRadius) {
 
   this.context.moveTo(X,Y)  
   arcCenter = arcCenter > 360 ? arcCenter - 360 : arcCenter;
    if ((arcCenter >= 270 || arcCenter <= 90)) 
      var operator =   1; 
    else 
      var operator =  -1 ;
    
    if (previousY == 0 && previousAngle == 0 ) 
      var distance = this.minHeight;
    else 
      var distance = previousY - Y; 
        
     distance = Math.abs(distance);   
             
    
    if ((arcCenter >= 270 || arcCenter <= 90)) {
      
      
      Y = (distance >= this.minHeight) ? ((Y > previousY) ? Y : previousY + this.minHeight): (previousY + this.minHeight);
      }
    else if (arcCenter > 90 && arcCenter <= 90) {
    
        Y = Y; 
      } 
      else {
     
        Y = (distance >= this.minHeight) ? ((Y < previousY) ? Y : previousY - this.minHeight): (previousY - this.minHeight);
     } 
      
      
     var X = this.findX(this.gCenterX,this.gCenterY,Y,operator,labelRadius);
     
     X =  typeof(X) == "undefined" ? ((operator == 1) ? (this.gCenterX + labelRadius) : (this.gCenterX - labelRadius)) : X
     
     var Y = Y; 
     
     this.context.lineTo(X,Y);
     this.context.strokeStyle = "#000000";
     this.context.stroke();
     this.drawPieText(X,Y,arcCenter,text);
     return Y;
    
}

Rchart.fn.findX = function(X,Y,Y1,alignment,labelRadius) {
 // var radius = (typeof(radius) == "undefined") ? this.labelRadius() : radius;
 var radius = labelRadius;
 
  Y1 = (Y1 > (radius+Y)) ? (radius + Y) : (Y1 < (Y-radius) ? (Y-radius) : Y1);
  var inverseAngle  = Math.asin((Y1 - Y)/radius);
  return X + alignment*radius*(Math.cos((Math.PI/180)*inverseAngle));                
 }
  
Rchart.fn.labelRadius = function() {
  return parseInt(this.definePieRadius()); 
}  
       
Rchart.fn.drawPieText = function(X,Y,arcCenter,text) {
    this.context.beginPath();
    
    this.context.font = this.fontSize+"pt "+ this.fontFamily;         
    //alert(context.measureText(text));
    //var textWidth =  context.measureText(text);
    X = (arcCenter > 90 && arcCenter <= 270) ? (X - (this.context.measureText(text).width + 4)): (X + 3) 
    //var textShift = 50 * operator;
    this.context.strokeText(text,X,Y+4);
    this.context.strokeStyle = this.fontColor;
    this.context.closePath();
}   
    
Rchart.fn.pieTotal = function(seriesValue) {
    var total = 0;
    var i = 0 ;
    while(i < seriesValue.length) {
        if (typeof(seriesValue[i]) == "number")
            total += seriesValue[i];
        else {
            console.log("Error in Pie Data");
            break
        }
        i++;
    }
    return total;
};

Rchart.fn.definePieRadius = function() {
    return ((this.pieRadius*5)/4);
};

Rchart.fn.findCenter = function(width,height) {
    this.gCenterX = width/2;
    this.gCenterY = height/2;
};
Rchart.fn.drawLegend =function(){
    var legend =this.data["legend"];
    if(typeof(legend)!="undefined")
    {
        var xPos = legend["xPos"];
        var yPos = legend["yPos"];
        var series = legend["series"];
        var textOptions = typeof(legend["textOptions"]) !="undefined" ? legend["textOptions"] : {};
        var legendAlign = typeof(legend["legendAlign"]) !="undefined" ? legend["legendAlign"] : "vertical";
        var textHeight = typeof(textOptions["fontSize"]) !="undefined" ? textOptions["fontSize"] : 10;
        var border = typeof(textOptions["border"]) !="undefined" ? textOptions["border"] : true;
        var backgroundColor=typeof(legend["backgroundColor"]) !="undefined" ? legend["backgroundColor"] : "#ffffff";
        var borderColor = typeof(legend["borderColor"]) !="undefined" ? legend["borderColor"] : "#000000";
        var maxWidth = 0;
        var maxHeight = textHeight;


        for(var i=0;i<series.length;i++)
        {
            var name = textOptions.merge({"x":xPos,"y":yPos,"text":series[0]});
            var textWidth = this.textWidth(name);
            if(legendAlign =="vertical")
            {

                if(textWidth > maxWidth)
                {
                    maxWidth = textWidth;
                }
                maxHeight = maxHeight + textHeight + 4
            }
            else
            {

                maxWidth = textWidth+maxWidth;
                maxHeight =  textHeight+10;
            }

        }
        maxHeight = maxHeight - 5;
        maxWidth  = maxWidth + 38;

        if(border)
        {
            if(legendAlign =="vertical")
            {
                this.drawFilledRoundedRectangle(xPos+1,yPos+1,xPos+maxWidth,yPos+maxHeight+1,5,borderColor);
                this.drawFilledRoundedRectangle(xPos,yPos,xPos+maxWidth,yPos+maxHeight,5,backgroundColor);
            }
            else
            {
                this.drawFilledRoundedRectangle(xPos+1,yPos+2,xPos+maxWidth+5,yPos+maxHeight+5,5,borderColor);
                this.drawFilledRoundedRectangle(xPos,yPos,xPos+maxWidth,yPos+maxHeight,5,backgroundColor);

            }
        }
        var yOffset =  textHeight;
        var xOffset = 4;

        for(i=0;i<series.length;i++)
        {
            var legendColor = typeof(this.findSeriesValues(series[i],"color"))!="undefined" ? this.findSeriesValues(series[i],"color") : "#000000";

            if(legendAlign =="vertical")
            {
                this.drawFilledRoundedRectangle((xPos+10),yPos+yOffset-4,xPos+18,yPos+yOffset+4,2,legendColor);
                name = textOptions.merge({"x":xPos+22,"y":yPos+yOffset+4,"text":series[i],"align":"left"});
                this.drawText(name);
                yOffset = yOffset + textHeight + 4;
            }
            else
            {
                var nameWidth =  this.textWidth(textOptions.merge({"x":0,"y":0,"text":series[i]}));
                this.drawFilledRoundedRectangle(xPos+xOffset,yPos+(textHeight/2)+1,xPos+xOffset+8,yPos+(textHeight/2)+10,2,legendColor);
                name = textOptions.merge({"x":xPos+xOffset+10,"y":yPos+textHeight+5,"text":series[i]});
                this.drawText(name);
                xOffset = xOffset + nameWidth + 12;

            }

        }
    }

};

Rchart.fn.drawZeroLine = function(value,color,showLabel,showOnRight,tickWidth,textOptions,freeText){
    showLabel = typeof(showLabel) !="undefined" ? showLabel : false;
    showOnRight = typeof(showOnRight) !="undefined" ? showOnRight : false;
    tickWidth = typeof(tickWidth) !="undefined" ? tickWidth : 4;
    var labelName = typeof(textOptions) !="undefined" ? textOptions : {};
    var y = this.gAreaY2 - (value - this.vMin) * this.divisionRatio;
    this.context.beginPath();
    if ( !(y <= this.gAreaY1 || y >= this.gAreaY2))
    {
        if ( tickWidth == 0 )
            this.drawLine(this.gAreaX1,y,this.gAreaX2,y,color);
        else
            this.drawDottedLine(this.gAreaX1,y+2,this.gAreaX2,y+2,tickWidth,color);
        if (showLabel )
        {
            if ( freeText == null )
                var   label = value;
            else
                var  label = freeText;
        }
        var fontSize = typeof(labelName["fontSize"]) !="undefined" ? labelName["fontSize"] : 10;
        var textColor = typeof(labelName["color"]) !="undefined" ? labelName["color"] : color;
        labelName = labelName.merge({"text":label,"color":textColor});
        if(showOnRight)
        {
            labelName = labelName.merge({"x":this.gAreaX2+2,"y":y+(fontSize/2)});

            this.drawText(labelName);
        }
        else
        {
            labelName = labelName.merge({"x":this.gAreaX1+2,"y":y-fontSize/2});
            this.drawText(labelName);

        }
    }


};
// Bar Graph Code
Rchart.fn.drawBarGraph = function(){



    var bar = this.data["graph"]["bar"];
    var noSeries = bar["values"];
    var width = this.graphWidth();
    var height = this.graphHeight();


    //set bar and gutter width
    var drawBorder= typeof(bar["border"]) != 'undefined';
    if(drawBorder){
        var borderColor = typeof(bar["borderColor"])!= "undefined" ? bar["borderColor"] : "#ffffff";
        var borderWidth = typeof(bar["borderWidth"])!= "undefined" ? bar["borderWidth"] : 1;
    }
  
    if(typeof(bar["gutterWidth"]) != 'undefined')
        var seriesWidth  = (this.divisionWidth-bar["gutterWidth"]*this.dataCount) /(noSeries.length+1);
    else
    var seriesWidth  = (this.divisionWidth) /(noSeries.length+1);
    var seriesXOffset = (this.divisionWidth  / 2 - seriesWidth / 2);
    var yZero  = this.gAreaY2 - ((0-this.vMin) * this.divisionRatio);

    if ( yZero> this.gAreaY2 )
        yZero = this.gAreaY2 ;

    for(var seriesL=0;seriesL<noSeries.length;seriesL++)
    {
        var values = this.findSeriesValues(noSeries[seriesL]);
        var barColor = this.findSeriesValues(noSeries[seriesL],"color");
        var xPos = this.gAreaX1 + this.gAreaXOffset - seriesXOffset + seriesWidth * seriesL;
        if(typeof(values) == "object")
        {
            var noOfValues = values.length;

            if(typeof(this.gAreaX1 != "undefined") && typeof(this.gAreaX2 != "undefined") && typeof(this.gAreaY1 != "undefined") && typeof(this.gAreaY2 != "undefined"))
            {
                this.context.beginPath();
                //Draw Actual Graph
                for(var i=0;i<values.length;i++)
                {
                    //Calculate X1 Position
                    var yPos =this.gAreaY2-((values[i]-this.vMin)*this.divisionRatio);
                    this.context.beginPath();
                    this.drawFilledRectangle(xPos+1,yZero,xPos+seriesWidth-1,yPos,barColor);
                    if(drawBorder)
                    {
                        this.drawLine(x1,y1,x1,y2+2.2,borderColor,borderWidth);
                        this.drawLine(x1,y1,x2,y1,borderColor,borderWidth);
                        this.drawLine(x2,y1,x2,y2+2.2,borderColor,borderWidth);
                    }
                    xPos = xPos + this.divisionWidth;
                }

            }

        }
    }
};
Rchart.fn.drawStackedBarGraph = function()
{
    var stackedBar = this.data["graph"]["stackedBar"];
    var noSeries = stackedBar["values"];
    var seriesWidth  = this.divisionWidth * 0.8;
    var seriesOfValues =[];
    var maxLength = 0;
    var yZero  = this.gAreaY2 - ((0-this.vMin) * this.divisionRatio);
    if ( yZero> this.gAreaY2 )
        yZero = this.gAreaY2 ;
    for(var i=0;i<noSeries.length;i++)
    {
        seriesOfValues[i] = this.findSeriesValues(noSeries[i]);
        if(maxLength <seriesOfValues[i].length)
        {
            maxLength = seriesOfValues[i].length;
        }
    }
    var xPos = this.gAreaX1 + this.gAreaXOffset - seriesWidth/2;
    for(var j=0;j<maxLength;j++)
    {
        var lastValue=0;


        for(i=0;i<noSeries.length;i++)
        {
            var barColor = this.findSeriesValues(noSeries[i],"color");
            var value =seriesOfValues[i][j];
            if(!isNaN(value))
            {

                if(i!=0)
                {
                    var   yPos    = this.gAreaY2 - (((value+lastValue)-this.vMin) * this.divisionRatio);
                    var  yBottom = this.gAreaY2 - ((lastValue-this.vMin) * this.divisionRatio);
                    var  lastValue= lastValue+ value;
                }
                else
                {
                    var   yPos    = this.gAreaY2 - ((value-this.vMin) *  this.divisionRatio);
                    var  yBottom = yZero;
                    var  lastValue = value;
                }
                this.context.beginPath();
                console.log(yPos);
                this.drawFilledRectangle(xPos+1,yBottom,xPos+seriesWidth-1,yPos,barColor);
            }

        }

        xPos = xPos + this.divisionWidth;


    }
};
Rchart.fn.drawAnimatedRectangle = function(x1,y1,x2,y2,color){
    var instant =this;
    this._intID = setTimeout(function() { instant.drawFilledRectangle(x1,y1+1,x2,y2,color); }, 1000);

};
//Rchart.fn.drawYAxisScale = function(minValue,maxValue,division,lineColor,color){
//    division = typeof(division) != 'undefined' ? division : 5;
//    color = typeof(color) != 'undefined' ? color : "#000000";
//    lineColor = typeof(lineColor) != 'undefined' ? lineColor : "#dedede";
//    var height = this.graphHeight();
//    var dataRange = Math.abs((maxValue - minValue));
//    var unitValue = dataRange/division;
//    var ratio = height/division;
//    //Draw Tick
//    var tickX =this.gAreaX1;
//
//    for(var i=0;i<=division;i++)
//    {
//        var tickY =this.gAreaY1+ratio*(i);
//        this.drawLine(tickX,tickY,tickX-10,tickY,color);
//
//
//
//        //Write No
//        var yLabel = maxValue-(unitValue*i);
//        this.drawText({"x":tickX-15-4,"y":tickY+2,"text":yLabel,"font":"Arial","fontSize":8});
//
//    }
//
//    for(var i=1;i<division;i++)
//    {
//        var tickY =this.gAreaY1+ratio*(i);
//        this.context.beginPath();
//        this.drawLine(this.gAreaX1,tickY,this.gAreaX2,tickY,lineColor,0.8);
//
//
//    }
//};
Rchart.fn.drawGraph = function()
{

    if (typeof(this.data["graph"] == "object"))
    {

        //Traversing Through present chart
        for (var chart in this.charts)
        {

            if (typeof(this.data["graph"][chart]) != "undefined")
            {
                //IF Graph Found draw graph
                //NEED SOME OPTIMIZATION USING KEY VALUE

                if(chart=="bar")
                {
                    var instant=this;
                    // this._intID = setInterval(function() { instant.drawBarGraph(); }, 100);

                    // setInterval(this.drawBarGraph(), 10);

                    this.drawBarGraph()
                }
                if(chart=="pie")
                {

                    this.drawPieGraph();
                    

                }
            }

        }
    }
};
Rchart.fn.createLinearGradientPalette =function(x1,y1,x2,y2,startColor,endColor){
    //if(typeof(color) != 'undefined')
    // this.context.fillStyle = color;
    var lGrd=this.context.createLinearGradient(x1,y1,x2,y2);
    lGrd.addColorStop(0,startColor ); // light blue
    lGrd.addColorStop(1,endColor); // dark bl
    this.context.fillStyle=lGrd;
    this.context.fill();
};
Rchart.fn.clearCanvas =function(){
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.context.beginPath();
};

//text options as follows

// {"x":10,"y":0,"text":"aaa","fontSize":"10pt","font":"Arial",align":"",stroke":true,"strokeColor":"#000000","lineWidth":1}
function Text(options)
{
    this.color =  typeof(options.color) != 'undefined' ? options.color : "#000000";
    this.text =   typeof(options.text) != 'undefined' ? options.text : "";
    this.x =   typeof(options.x) != 'undefined' ? options.x : 0;
    this.y =   typeof(options.y) != 'undefined' ? options.y : 0;
    this.font =   typeof(options.font) != 'undefined' ? options.font : "Arial";
    this.fontSize = typeof(options.fontSize) != 'undefined' ? options.fontSize : 10;
    this.align = typeof(options.align) != 'undefined' ? options.align : "center";
    this.stroke =   typeof(options.stroke) != 'undefined' ? options.stroke : false;
    this.lineWidth =   typeof(options.lineWidth) != 'undefined' ? options.lineWidth : 1;
    this.strokeColor =   typeof(options.strokeColor) != 'undefined' ? options.strokeColor : "#000000";

}
function RGBColor(color) {
    this.color = color;
    this.getColor = function(){
        return this.color;
    };

    this.getDecimalVals = function(color){
        var color = typeof(color) != 'undefined' ? color : this.color;
        var rgb;
        var colorObj;
        color = this.getHexVals(color);
        //Replace hex prefixes if present
        color = color.replace("0x", "");
        color = color.replace("#", "");
        rgb = parseInt(color, 16);
        colorObj = new Object();
        colorObj.red = (rgb & (255 << 16)) >> 16;
        colorObj.green = (rgb & (255 << 8)) >> 8;
        colorObj.blue = (rgb & 255);
        return colorObj;
    };
    this.getHexVals = function(color)
    {
        var col = typeof(color) != 'undefined' ? color : this.color;
        if(col.substr(0, 1) === '#') {
            return color;
        }
        var digits = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(col);
        var hexcolor= digits ? (1 << 24 | digits[1] << 16 | digits[2] << 8 | digits[3]).toString(16).substr(1) : col;
        return "#"+hexcolor.toString(16);
    };
};



//ARRAY METHODS
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (!isNaN(this[i]) && this[i] > max)
            max = this[i];
    return max;
};
Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (this[i] < min)
            min = this[i];
    return min;
};
//Hash Merging //NEED TO BE MODIFIED
Object.prototype.merge = function(source) {
    for (var property in source)
        this[property] = source[property];
    return this;
};

min = function(n1,n2) {
    if (n1 > n2)
        return n2;
    if (n1 < n2)
        return n1;
    if (n2 == n1)
        return n2;
}
function roundOf(num, dec) { // Arguments: number to round, number of decimal places
    return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
}
/* This code add native support to draw dahed line
 * Many Thanks to
 * http://davidowens.wordpress.com/2010/09/07/html-5-canvas-and-dashed-lines/
 * Changes done as per my need
 * */

CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
    // Our growth rate for our line can be one of the following:
    //   (+,+), (+,-), (-,+), (-,-)
    // Because of this, our algorithm needs to understand if the x-coord and
    // y-coord should be getting smaller or larger and properly cap the values
    // based on (x,y).
    var lt = function (a, b) { return a <= b; };
    var gt = function (a, b) { return a >= b; };
    var capmin = function (a, b) { return Math.min(a, b); };
    var capmax = function (a, b) { return Math.max(a, b); };

    var checkX = { thereYet: gt, cap: capmin };
    var checkY = { thereYet: gt, cap: capmin };

    if (fromY - toY > 0) {
        checkY.thereYet = lt;
        checkY.cap = capmax;
    }
    if (fromX - toX > 0) {
        checkX.thereYet = lt;
        checkX.cap = capmax;
    }

    this.moveTo(fromX, fromY);
    var offsetX = fromX;
    var offsetY = fromY;

    var idx = 0, dash = true;
    while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
        var ang = Math.atan2(toY - fromY, toX - fromX);
        var len = pattern;

        offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
        offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));

        if (dash)
        {

            this.lineTo(offsetX, offsetY);
        }
        else
        {
            this.moveTo(offsetX, offsetY);
        }

        idx = (idx + 1) % pattern;
        dash = !dash;
    }

};
