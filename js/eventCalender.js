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
        },
        {
            name: "Product Discussion",
            description: "Discussion with customers on how to help them more.",
            startTime : "03/20/2015 10:00 AM",
            endTime : "03/20/2015 12:00 PM"
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
        for(var i=0,len=settings.calDays.length;i<len;i++){
            if (settings.calDays[i].date == parseInt(event.target.textContent, 10) && settings.calDays[i].events.length > 0) {
                eventsToAdd.push(settings.calDays[i].events);
            }
        }

        // If events is present for current day, then add them to event list.
        if (eventsToAdd.length > 0)
            document.getElementById("events").appendChild(addListEvents(eventsToAdd[0]));
    }
});

// Adds events to the event list in html and returns the html as string.
function addListEvents(eventsToAdd){
    var docFragment = document.createDocumentFragment();
    var monthHeadDiv = document.createElement('div');
    monthHeadDiv.className = 'btn btn-danger btn-block';
    var monthHead = new Date(eventsToAdd[0].startTime).toDateString();
    monthHeadDiv.appendChild(document.createTextNode(monthHead));
    docFragment.appendChild(monthHeadDiv);
    var listGroupDiv = document.createElement('div');
    listGroupDiv.className ='list-group';


    for(var i=0,len=eventsToAdd.length;i<len;i++){
        var listGroupItemDiv = document.createElement('div');
        listGroupItemDiv.className = 'list-group-item';
        var listGroupItemHeadH4 = document.createElement('h4');
        listGroupItemHeadH4.className = 'list-group-item-heading';
        var listGroupItemText = document.createElement('p');
        listGroupItemText.className = 'list-group-item-text';
        var listTimeText = document.createElement('p');
        var timeIcon = document.createElement('span');
        timeIcon.className = 'glyphicon glyphicon-time';
        listTimeText.appendChild(timeIcon);
        listGroupItemHeadH4.appendChild(document.createTextNode(eventsToAdd[i].name));
        listGroupItemText.appendChild(document.createTextNode(eventsToAdd[i].description));
        listTimeText.appendChild(document.createTextNode(eventsToAdd[i].startTime.substr(10,9) +
            ' to ' + eventsToAdd[i].endTime.substr(10,9)));
        listGroupItemDiv.appendChild(listGroupItemHeadH4);
        listGroupItemDiv.appendChild(listGroupItemText);
        listGroupItemDiv.appendChild(listTimeText);
        listGroupDiv.appendChild(listGroupItemDiv);
    }
    docFragment.appendChild(listGroupDiv);

    return docFragment;
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
        var isEvents = (function () {
            var eventsPresent = false;
            for(var i=0,len=settings.calenderEvents.length;i<len;i++){
                var startDate = new Date(settings.calenderEvents[i].startTime).getDate();
                var startMonth = new Date(settings.calenderEvents[i].startTime).getMonth()+1;
                var startYear = new Date(settings.calenderEvents[i].startTime).getFullYear();
                if(startDate===parseInt(thisCalDay,10) && startMonth===month && startYear===year){
                    day.events.push(settings.calenderEvents[i]);
                    eventsPresent = true;
                }
            }
            return eventsPresent;
        })();

        if (thisCalDay==scanForToday)
            thisCalDay='<span id="today">'+thisCalDay+'</span>';
        if(isEvents) {
            calenderHtml += '<td class="' + dateClass + ' hasEvent">' + thisCalDay + '</td>';
        }
        else {
            calenderHtml += '<td class="' + dateClass + '">' + thisCalDay + '</td>';
        }
        settings.calDays.push(day);
        if(((i)%7==0)&&(i<36))
            calenderHtml+='</tr>' +
            '<tr>';
    }
    return calenderHtml+='</tr></table></div>';
}



