(function(){"use strict";angular.module("app.form.validation",[]).controller("wizardFormCtrl",["$scope",function(r){return r.wizard={firstName:"some name",lastName:"",email:"",password:"",age:"",address:""},r.isValidateStep1=function(){return console.log(r.wizard_step1),console.log(""!==r.wizard.firstName),console.log(""===r.wizard.lastName),console.log(""!==r.wizard.firstName&&""!==r.wizard.lastName)},r.finishedWizard=function(){return console.log("yoo")}}]).controller("formConstraintsCtrl",["$scope",function(r){var n;return r.form={required:"",minlength:"",maxlength:"",length_rage:"",type_something:"",confirm_type:"",foo:"",email:"",url:"",num:"",minVal:"",maxVal:"",valRange:"",pattern:""},n=angular.copy(r.form),r.revert=function(){return r.form=angular.copy(n),r.form_constraints.$setPristine()},r.canRevert=function(){return!angular.equals(r.form,n)||!r.form_constraints.$pristine},r.canSubmit=function(){return r.form_constraints.$valid&&!angular.equals(r.form,n)}}]).controller("signinCtrl",["$scope",function(r){var n;return r.user={email:"",password:""},r.showInfoOnSubmit=!1,n=angular.copy(r.user),r.revert=function(){return r.user=angular.copy(n),r.form_signin.$setPristine()},r.canRevert=function(){return!angular.equals(r.user,n)||!r.form_signin.$pristine},r.canSubmit=function(){return r.form_signin.$valid&&!angular.equals(r.user,n)},r.submitForm=function(){return r.showInfoOnSubmit=!0,r.revert()}}]).controller("signupCtrl",["$scope",function(r){var n;return r.user={name:"",email:"",password:"",confirmPassword:"",age:""},r.showInfoOnSubmit=!1,n=angular.copy(r.user),r.revert=function(){return r.user=angular.copy(n),r.form_signup.$setPristine(),r.form_signup.confirmPassword.$setPristine()},r.canRevert=function(){return!angular.equals(r.user,n)||!r.form_signup.$pristine},r.canSubmit=function(){return r.form_signup.$valid&&!angular.equals(r.user,n)},r.submitForm=function(){return r.showInfoOnSubmit=!0,r.revert()}}]).directive("validateEquals",[function(){return{require:"ngModel",link:function(r,n,e,t){var a;return a=function(n){var a;return a=n===r.$eval(e.validateEquals),t.$setValidity("equal",a),"function"==typeof a?a({value:void 0}):void 0},t.$parsers.push(a),t.$formatters.push(a),r.$watch(e.validateEquals,function(r,n){return r!==n?t.$setViewValue(t.$ViewValue):void 0})}}}])}).call(this);
