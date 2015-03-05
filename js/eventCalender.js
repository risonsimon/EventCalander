var todayDate = new Date();
// Settings object which contains the event list and other common items.
var settings = {
    calenderEvents : [
        {
            name: "Product Workshop",
            description: "Product workshop will help to find more about the product.",
            startTime : "03/12/2015 11:00 AM",
            endTime : "03/12/2015 04:00 PM"
        },
        {
            name: "Product Demo",
            description: "Product demo will help you to understand product features better.",
            startTime : "03/14/2015 10:00 AM",
            endTime : "03/14/2015 12:00 PM"
        },
        {
            name: "Product Demo Part 2",
            description: "Product demo will help you to understand product features better.",
            startTime : "03/14/2015 02:00 PM",
            endTime : "03/14/2015 04:00 PM"
        }
    ],
    calDays : [],
    selected : '',
    currentMonth: todayDate.getMonth()+1,
    currentYear:todayDate.getFullYear()
};

// Constructor for a day. A day can have a date and have events.
var calDay = function (date) {
    this.date = date;
    this.events = [];
};

// Generating calender.
document.getElementById("calender").innerHTML=buildCal(settings.currentMonth ,settings.currentYear, "daysOfWeek", "days");


// Add click event for all 'td' of table. Made possible by event bubbling. A single
// event handler is attached to top 'div'.
document.getElementById("calender").addEventListener("click", function (event) {
    // Only clicks on 'td' elements are used.
    if(event.target.tagName === 'TD') {

        // clear all events.
        document.getElementById("events").innerHTML = '';
        var eventsToAdd = [];

        // Find all events for the current day from the day objects.
        $.grep(settings.calDays, function (element) {
            if (element.date == parseInt(event.target.textContent, 10) && element.events.length > 0) {
                eventsToAdd.push(element.events);
            }
        });
        // If events is present for current day, then add them to event list.
        if (eventsToAdd.length > 0)
            document.getElementById("events").innerHTML = addListEvents(eventsToAdd[0]);
    }
});

// Adds events to the event list in html and returns the html as string.
function addListEvents(eventsToAdd){
    var html = '<div class="btn btn-danger btn-block">'+new Date(eventsToAdd[0].startTime).toDateString()+'</div>' +
        '<div class="list-group">';
    $.each(eventsToAdd, function () {
        html += '<div class="list-group-item">'+
        '<h4 class="list-group-item-heading">'+this.name+'</h4>'+
        '<p class="list-group-item-text">'+this.description+'</p>'+
        '<p><b>Start Time : </b>'+this.startTime.substr(10,9)+'<br/>'+
        '<b>End Time : </b>'+this.endTime.substr(10,9)+'</p>'+
        '</div>';
    });
    return html+='</div>';
}

// Modified script for generating calender from : http://www.dynamicdrive.com/dynamicindex7/basiccalendar.js
function buildCal(month, year,dayClass, dateClass){
    var monthArray=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var numberOfDays=[31,0,31,30,31,30,31,31,30,31,30,31];

    var oDate = new Date(year, month-1, 1); //DD replaced line to fix date bug when current day is 31st
    oDate.day=oDate.getDay()+1; //DD replaced line to fix date bug when current day is 31st

    var todayDate=new Date(); //DD added
    var scanForToday=(year==todayDate.getFullYear() && month==todayDate.getMonth()+1)? todayDate.getDate() : 0; //DD added

    numberOfDays[1]=(((oDate.getFullYear()%100!=0)&&(oDate.getFullYear()%4==0))||(oDate.getFullYear()%400==0))?29:28;
    var calenderHtml=
        '<div class="monthHeading btn btn-warning btn-block text-center">'+monthArray[month-1]+' - '+year+'</div>' +
        '<table class="calenderTable table">' +
        '<tr>';
    // To set the top day heading.
    for(s=0;s<7;s++)
        calenderHtml+='<th class="'+dayClass+'">'+"SMTWTFS".substr(s,1)+'</th>';
    calenderHtml+='</tr>' +
    '<tr>';
    for(i=1;i<=42;i++){
        if((i-oDate.day>=0)&&(i-oDate.day<numberOfDays[month-1]))
            var thisCalDay= i-oDate.day+1;
        else
            continue;
        // Create the day object.
        var day = new calDay(thisCalDay);
        // Get the events for the date and add them to the day object.
        var eventsToAdd = $.grep(settings.calenderEvents, function (element) {
            var startDate = new Date(element.startTime).getDate();
            var startMonth = new Date(element.startTime).getMonth()+1;
            var startYear = new Date(element.startTime).getFullYear();
            if(startDate===parseInt(thisCalDay,10) && startMonth===month && startYear===year){
                day.events.push(element);
                return element;
            }
        });

        if (thisCalDay==scanForToday)
            thisCalDay='<span id="today">'+thisCalDay+'</span>';
        if(eventsToAdd.length>0) {
            calenderHtml += '<td class="' + dateClass + ' hasEvent">' + thisCalDay + '</td>';
        }
        else
            calenderHtml+='<td class="'+dateClass+'">'+thisCalDay+'</td>';
        settings.calDays.push(day);
        if(((i)%7==0)&&(i<36))
            calenderHtml+='</tr>' +
            '<tr>';
    }
    return calenderHtml+='</tr></table></div>';
}



