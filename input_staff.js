

'use strict';

var dappAddress = "n1zdqWBYt1zsCVobayL1SJEKpkuGwWo2voV";
var InputStaff = function() {

}
InputStaff.prototype = {

    init: function() {
        var self = this;
        $("#submit").click(function() {
            self.commitStaff();
        });
    },

    commitStaff: function() {
        var staff_name = $("#staff_name").val();
        var staff_sex = $("#staff_sex").val();
        var staff_birthday = $("#staff_birthday").val();
        var staff_email = $("#staff_email").val();
        var self_evaluation = $("#self_evaluation").val();
        var warning_note = "";
        if(staff_name == "") {
            warning_note = "您的昵称不能为空";
            $("#staff_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#staff_input_warning").show();
            // 弹框
            return;
        }
        if (staff_sex == "") {
            warning_note = "请选择您的性别";
            $("#staff_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#staff_input_warning").show();
            // 弹框
            return;
        }
        if (staff_birthday == "") {
            warning_note = "请填写您的生日";
            $("#staff_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#staff_input_warning").show();
            // 弹框
            return;
        }
        if (staff_email == "") {
            warning_note = "请填写您的Email";
            $("#staff_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#staff_input_warning").show();
            // 弹框
            return;
        }
        if (self_evaluation == "") {
            warning_note = "填写您的详细自评";
            $("#staff_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#staff_input_warning").show();
            // 弹框
            return;
        }
        // 提交
        var func = "add_staff_to_list";
        var req_arg_item = {
            "name": staff_name,
            "sex": staff_sex,
            "birthday": staff_birthday,
            "email": staff_email,
            "self_evaluation": self_evaluation
        };
        var req_args = [];
        req_args.push(req_arg_item);

        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : func,
                    "args" : JSON.stringify(req_args),
                }
            },
            "method": "neb_sendTransaction"
        }, "*");
    },

    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
                    console.log(obj);
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },
}

var inputStaffObj;

function checkNebpay() {
    console.log("check nebpay")
    try{
        var NebPay = require("nebpay");
    }catch(e){
        //alert ("Extension wallet is not installed, please install it first.")
        console.log("no nebpay");
        $("#noExtension").removeClass("hide")
    }

    // 环境ok，拉取数据
    inputStaffObj = new InputStaff();
    inputStaffObj.init();
    inputStaffObj.listenWindowMessage();
}



function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#staff_input_warning").hide();
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    