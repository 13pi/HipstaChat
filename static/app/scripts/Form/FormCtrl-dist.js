(function(){"use strict";angular.module("app.ui.form.ctrls",[]).controller("TagsDemoCtrl",["$scope",function(e){return e.tags=["foo","bar"]}]).controller("DatepickerDemoCtrl",["$scope",function(e){return e.today=function(){return e.dt=new Date},e.today(),e.showWeeks=!0,e.toggleWeeks=function(){return e.showWeeks=!e.showWeeks},e.clear=function(){return e.dt=null},e.disabled=function(e,t){return"day"===t&&(0===e.getDay()||6===e.getDay())},e.toggleMin=function(){var t;return e.minDate=null!=(t=e.minDate)?t:{"null":new Date}},e.toggleMin(),e.open=function(t){return t.preventDefault(),t.stopPropagation(),e.opened=!0},e.dateOptions={"year-format":"'yy'","starting-day":1},e.formats=["dd-MMMM-yyyy","yyyy/MM/dd","shortDate"],e.format=e.formats[0]}]).controller("TimepickerDemoCtrl",["$scope",function(e){return e.mytime=new Date,e.hstep=1,e.mstep=15,e.options={hstep:[1,2,3],mstep:[1,5,10,15,25,30]},e.ismeridian=!0,e.toggleMode=function(){return e.ismeridian=!e.ismeridian},e.update=function(){var t;return t=new Date,t.setHours(14),t.setMinutes(0),e.mytime=t},e.changed=function(){return console.log("Time changed to: "+e.mytime)},e.clear=function(){return e.mytime=null}}]).controller("TypeaheadCtrl",["$scope",function(e){return e.selected=void 0,e.states=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]}]).controller("RatingDemoCtrl",["$scope",function(e){return e.rate=7,e.max=10,e.isReadonly=!1,e.hoveringOver=function(t){return e.overStar=t,e.percent=100*(t/e.max)},e.ratingStates=[{stateOn:"glyphicon-ok-sign",stateOff:"glyphicon-ok-circle"},{stateOn:"glyphicon-star",stateOff:"glyphicon-star-empty"},{stateOn:"glyphicon-heart",stateOff:"glyphicon-ban-circle"},{stateOn:"glyphicon-heart"},{stateOff:"glyphicon-off"}]}])}).call(this);
