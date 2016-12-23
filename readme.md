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
Firstly, wrangling the data that came out of the proprietary was not all that straightforward.  I had to do a large clean-up project to prune a lot of irrelevant columns and rows.

Obviously I did not use any of the School Donations data and while I did harvest a small amount of the javascript from that, most of my js is almost completely customised.  In addition to that, a lot of the data had to be inferred.
