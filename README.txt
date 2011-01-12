rchart-js is java script library based on canvas.

Common Parameters

"series" contain array of series with "name"  as key in each index
as series name."value" is used for actual series value it is always in array/
"color"  color determine colour of series

"xLabelSeries" determines which series contain x axis label name. it has value is series name


In general to draw a text following options are used in following way
### TEXT OPTION ###
 {"x":10,"y":0,"text":"aaa","fontSize":"10","font":"Arial",align":"left/right/center",stroke":true,"strokeColor":"#000000","lineWidth":1}

  "x" : starting x Position default 0
  "y" : starting Y Position default 0
  "fontSize" : Font Size default 10
  "font": font name  default "Arial"
  "align": "left/right/center" default "center"
  "stroke": true/false default "false"
  "strokeColor" :Color  default "#000000"
  "lineWidth": number   default 1

"axis" key used for setting x and y axis name
"x" key determines  X axis it contains again value field which contains text option
"y" key determines  Y axis it contains again value field which contains text option

"legend" key used to draw legend.Following options can be set
 Required Parameter
 "series" : [Array Of series name]
 "xPos"   : X position of legend
 "yPos"   : Y position of legend   
 Optional Parameter
 "textOptions":Text Options,
 "border":true/false, default true
 "backgroundColor":color default "#ffffff",
 "borderColor":color default "#000000",
 "legendAlign":"vertical/horizontal" default vertical


"graph" is used for plotting graph
It contains following graph
"bar"
  Required Parameter
  "values":[Array Of series name]
  Optional
  "gutterWidth":10 default is 10
  "border":true/false default false
  "borderColor":color default "#ffffff"
  "borderWidth":number default 1

var x ={

        "series":[
          {
            "name":"series1",
            "value":[-2,9,2,3,8],
            "color":"#DDDF0D"

          },
          {
            "name":"series2",
            "value":[2,4,6,8],
            "color":"#7798BF"
          },
          {
            "name":"series4",
            "value":[0,1,3,4,5],
            "color":"#55BF3B"
          },
          {
            "name":"series3",
            "value":["Jan","Feb","March","April","May"]
          }
        ],
        "xLabelSeries":"series3",
        "axis" :
        {
          "x":{"value":{"text":"Name Of x axis"}},
          "y":{"value":{"text":"Name Of y AXIS dsdsdd d sdd dd dhshds dsd"}}
        },

        "legend":{
          "series":["series1","series2","series4"],
          "xPos":600,
          "yPos":70,
          "textOptions":{"color":"#000000","font":"Arial","fontSize":10},
          "border":true,
          "backgroundColor":"#ffffff",
          "borderColor":"#dddddd",
          "legendAlign":"vertical"

        },
        "graph" :{
          "bar":{
            "values" : ["series1","series2","series4"],
            "gutterWidth": 10,
            "border":true,
            "borderColor":"#ffffff",
            "borderWidth":1
          },
        }
      };

Following Methods are used to draw chart based on data.

# Create Chart Object it requires an id of canvas object,and data
  new Rchart(id,data)
  var rchart = new Rchart("example1",x);

# Instance Method
# To set graph Area Compulsory required
   x1,y1 starting position
   x2,y2 Ending Position
   setGraphArea(x1,y1,x2,y2);

#  Draw Rectangle
 drawRectangle(x1,y1,x2,y2,color)
 color is used for border color

# Draw Filled rectangle
 drawFilledRectangle(x1,y1,x2,y2,color,border)
 border is true or false by default true it draws a border 

# Draw Rounded Rectangle
drawRoundedRectangle(x1,x2,width,height,radius,color)

#Draw filled rounded rectangle
drawFilledRoundedRectangle(x1,y1,x2,y2,radius,color);

# Set Background Image
setBackGroundImage(image src);

# Set Linear Gradient palette
createLinearGradientPalette(x1,y1,x2,y2,startColor,endColor)

# Draw Graph Area sets Background color of graph
  drawGraphArea(color,stripe)
  stripe false/true default is false it draws a stripe

# Set Fixed Scale it sets fixed scale it bypass automated scale
 setFixedScale(minimum,maximum,division);
 set minimum,maximum value further you can set no of division

# Draw scale
    drawScale(data,mode,color,drawTicks,align,decimals,margin,skipLabel,rightScale,font,fontSize);
    required argument
    data is on which series you have to plot data ["series1","series2"]
    mode is required how to draw scale
    1 for normal scale
    2 add all series value
    3 scale start from 0
    4 add all series and start from 0
    color of scale
# Draw Grid
  drawGrid(lineWidth,color,dotted,vertical);
  dotted = true/false to plot dotted line
  vertical = true/false to plot vertical line  
# To draw Bar graph
    drawBarGraph();
  It requires bar value in graph

# Draw Legend
    drawLegend();

# drawZeroLine(value,color,showLabel,showOnRight,tickWidth,textOptions,freeText)
 value at which value draw line
 color of line
 showLabel i.e display value if freetext is given than display free text
 tickWidth is dotSize Of line if 1 then draw Plain Line else plot dotted line
 textOptions TextOptions for label


    


