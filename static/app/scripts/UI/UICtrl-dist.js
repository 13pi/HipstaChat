(function(){"use strict";angular.module("app.ui.ctrls",[]).controller("NotifyCtrl",["$scope","logger",function(e,t){return e.notify=function(e){switch(e){case"info":return t.log("Heads up! This alert needs your attention, but it's not super important.");case"success":return t.logSuccess("Well done! You successfully read this important alert message.");case"warning":return t.logWarning("Warning! Best check yo self, you're not looking too good.");case"error":return t.logError("Oh snap! Change a few things up and try submitting again.")}}}]).controller("AlertDemoCtrl",["$scope",function(e){return e.alerts=[{type:"success",msg:"Well done! You successfully read this important alert message."},{type:"info",msg:"Heads up! This alert needs your attention, but it is not super important."},{type:"warning",msg:"Warning! Best check yo self, you're not looking too good."},{type:"danger",msg:"Oh snap! Change a few things up and try submitting again."}],e.addAlert=function(){var t,i;switch(t=Math.ceil(4*Math.random()),i=void 0,t){case 0:i="info";break;case 1:i="success";break;case 2:i="info";break;case 3:i="warning";break;case 4:i="danger"}return e.alerts.push({type:i,msg:"Another alert!"})},e.closeAlert=function(t){return e.alerts.splice(t,1)}}]).controller("ProgressDemoCtrl",["$scope",function(e){return e.max=200,e.random=function(){var t,i;i=Math.floor(100*Math.random()+10),t=void 0,t=25>i?"success":50>i?"info":75>i?"warning":"danger",e.showWarning="danger"===t||"warning"===t,e.dynamic=i,e.type=t},e.random()}]).controller("AccordionDemoCtrl",["$scope",function(e){e.oneAtATime=!0,e.groups=[{title:"Dynamic Group Header - 1",content:"Dynamic Group Body - 1"},{title:"Dynamic Group Header - 2",content:"Dynamic Group Body - 2"},{title:"Dynamic Group Header - 3",content:"Dynamic Group Body - 3"}],e.items=["Item 1","Item 2","Item 3"],e.status={isFirstOpen:!0,isFirstOpen1:!0,isFirstOpen2:!0,isFirstOpen3:!0,isFirstOpen4:!0,isFirstOpen5:!0,isFirstOpen6:!0},e.addItem=function(){var t;t=e.items.length+1,e.items.push("Item "+t)}}]).controller("CollapseDemoCtrl",["$scope",function(e){return e.isCollapsed=!1}]).controller("ModalDemoCtrl",["$scope","$modal","$log",function(e,t,i){e.items=["item1","item2","item3"],e.open=function(){var n;n=t.open({templateUrl:"myModalContent.html",controller:"ModalInstanceCtrl",resolve:{items:function(){return e.items}}}),n.result.then(function(t){e.selected=t},function(){i.info("Modal dismissed at: "+new Date)})}}]).controller("ModalInstanceCtrl",["$scope","$modalInstance","items",function(e,t,i){e.items=i,e.selected={item:e.items[0]},e.ok=function(){t.close(e.selected.item)},e.cancel=function(){t.dismiss("cancel")}}]).controller("PaginationDemoCtrl",["$scope",function(e){return e.totalItems=64,e.currentPage=4,e.setPage=function(t){return e.currentPage=t},e.maxSize=5,e.bigTotalItems=175,e.bigCurrentPage=1}]).controller("TabsDemoCtrl",["$scope",function(e){return e.tabs=[{title:"Dynamic Title 1",content:"Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at."},{title:"Disabled",content:"Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.",disabled:!0}],e.navType="pills"}]).controller("TreeDemoCtrl",["$scope",function(e){return e.list=[{id:1,title:"Item 1",items:[]},{id:2,title:"Item 2",items:[{id:21,title:"Item 2.1",items:[{id:211,title:"Item 2.1.1",items:[]},{id:212,title:"Item 2.1.2",items:[]}]},{id:22,title:"Item 2.2",items:[{id:221,title:"Item 2.2.1",items:[]},{id:222,title:"Item 2.2.2",items:[]}]}]},{id:3,title:"Item 3",items:[]},{id:4,title:"Item 4",items:[{id:41,title:"Item 4.1",items:[]}]},{id:5,title:"Item 5",items:[]},{id:6,title:"Item 6",items:[]},{id:7,title:"Item 7",items:[]}],e.selectedItem={},e.options={},e.remove=function(e){e.remove()},e.toggle=function(e){e.toggle()},e.newSubItem=function(e){var t;t=e.$modelValue,t.items.push({id:10*t.id+t.items.length,title:t.title+"."+(t.items.length+1),items:[]})}}]).controller("MapDemoCtrl",["$scope","$http","$interval",function(e,t,i){var n,o;for(o=[],n=0;8>n;)o[n]=new google.maps.Marker({title:"Marker: "+n}),n++;e.GenerateMapMarkers=function(){var t,i,r,s,a;for(t=new Date,e.date=t.toLocaleString(),a=Math.floor(4*Math.random())+4,n=0;a>n;)i=43.66+Math.random()/100,r=-79.4103+Math.random()/100,s=new google.maps.LatLng(i,r),o[n].setPosition(s),o[n].setMap(e.map),n++},i(e.GenerateMapMarkers,2e3)}])}).call(this);