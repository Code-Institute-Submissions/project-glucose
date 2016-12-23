# GlucoTrend
## Data visualisation for Diabetes Management

[Live site](https://gluco-trend.herokuapp.com/)

#### Technologies
* Crossfilter.js
* DC.js
* D3.js
* MongoDB
* Flask framework
* queue.js
* Heroku deployment

#### About
I have type 1 (insulin dependant) diabetes.  I have an insulin pump which is capable, via bluetooth connection to a dongle, to upload data to a java applet which runs on the pump manufacturer's website.  From there I can generate several PDF reports which include some charts and datatables, though these are mostly visually unappealing and in every case, extracting anything useful from them requires considerable analysis, usually with the help of a healthcare professional, in order to make changes to my insulin regime.  The technology is functional enough but is beginning to show its age and has never been a particulary pleasing aesthetic experience. Some example screenshots:

![Minimed proprietary screen](https://github.com/jodiegardiner/project-glucose/blob/master/minimed2.png)

![Minimed proprietary screen](https://github.com/jodiegardiner/project-glucose/blob/master/minimed3.png)

Indeed, the applet is written in Java as mentioned, and does not work on modern browsers at all, which is an inconvenience to the user, to say the least.  I wanted to create a responsive data visualisation app that could provide me with useful information much more easily without having to pore over report after report and which would run in any browser on any platform.

#### Discoveries/functionality
Within a couple of clicks I had identified a pattern of high blood glucose levels overnight and in the morning and this prompted me to make a change to my insulin regime.  I would have been able to discern this pattern from the native app but doing so would involve cross-referencing multiple pdfs (indeed, often at the Diabetes Clinic, the specialist literally prints off multiple pages and lays them out on a gurney for us to look at side by side). With my app I can achieve that in just a few seconds. This shows the power both of the libraries powering the charts and data visualisation in general. And this was with only a tiny snippet of the available data being charted.

#### Issues/Obstacles
Firstly, wrangling the data that came out of the proprietary was not all that straightforward.  I had to do a large clean-up project to prune a lot of irrelevant columns and rows. Having said that, once I had established a format that I wanted, getting future data into that forward is actually a very straightforward process, meaning that I can update it with future data with only 10-15 minutes work.

Obviously I did not use any of the School Donations data and while I did harvest a small amount of the javascript from that, most of my js is heavily customised.  In addition to that, two of my "columns" were added to the data using functions written in draw_graphs.js.  This allowed me to create the Time Period and BGRating pie charts which actually do most of the work in terms of displaying the raw data in a useful way that allows me to quickly spot trends on a wider scale.

I had a great deal of difficulty getting "Overall Average Blood Glucose" to work.  While there exists a relatively easy way to get a sum or a count of data, getting an average was no simple task (to my mind it absolutely should be, as surely this is a much sought after bit of information that one would want during many kinds of data handling?).

The solution to this was actually the part that I spent most time on over the course of the project and while it condenses down into not many lines of code, finding the correct combination of reduceAdd, reduceInitial and reduceRemove syntaxes proved elusive, to say the least. This remains what I believe to be the biggest win of the project for me personally for two reasons;  it was difficult to get right, and the average BG is a vital stat to be able to instantly see meaningful patterns amidst the data.

I decided to go with 2 chart types deliberately (3 if you count the calculations that needed to be performed to get Average BG and Number of Excursions).  While I could have added further types (and indeed tried out a few) much of the simplicity was lost in terms of interpretation, as well as the visual look being very disrupted when the charts went "below the fold" on a standard laptop or desktop display. The wide charts also don't play particularly well with narrow screen widths, but I did the best I could.  There did not seem to be a way to make the axes responsive on line charts, so the data will overlap the edge of their container divs when on smaller screens.

Overall I think I have produced something which clearly demonstrates the power of data visualisation and also which immediately and tangibly proved to be a useful tool in managing my own diabetes. Something I am reaping the rewards from to this day.
