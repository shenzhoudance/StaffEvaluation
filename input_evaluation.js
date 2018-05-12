

'use strict';

var dappAddress = "n1zdqWBYt1zsCVobayL1SJEKpkuGwWo2voV";
var InputEvaluation = function() {

}
InputEvaluation.prototype = {

    init: function() {
        var self = this;
        $("#submit").click(function() {
            self.commitEvaluation();
        });
    },

    commitEvaluation: function() {
        var self = this;
        var hr_name = $("#hr_name").val();
        var hr_company = $("#hr_company").val();
        var staff_add = $("#staff_add").val();
        var evaluation_num = $("#evaluation_num").val();
        var evaluation_detail = $("#evaluation_detail").val();
        var warning_note = "";
        if(hr_name == "") {
            warning_note = "您的昵称不能为空";
            $("#evaluation_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#evaluation_input_warning").show();
            // 弹框
            return;
        }
        if (hr_company == "") {
            warning_note = "您的公司不能为空";
            $("#evaluation_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#evaluation_input_warning").show();
            // 弹框
            return;
        }
        if (staff_add == "") {
            warning_note = "评价员工地址不能为空";
            $("#evaluation_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#evaluation_input_warning").show();
            // 弹框
            return;
        }
        if (evaluation_num == "") {
            warning_note = "评分不能为空";
            $("#evaluation_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#evaluation_input_warning").show();
            return;
        }
        if (evaluation_detail == "") {
            warning_note = "详细评价内容不能为空";
            $("#evaluation_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#evaluation_input_warning").show();
            // 弹框
            return;
        }
        // 提交
        var func = "add_staff_evaluation";
        var req_arg = {
            "staffId": staff_add,
            "company": hr_company,
            "hrName": hr_name,
            "star": evaluation_num,
            "evaTime": self.getNowFormatDate(),
            "evaluation": evaluation_detail
        };
        var req_args = [];
        req_args.push(req_arg);

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
            }
        });
    },

    getNowFormatDate: function() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }
}

var inputEvaluationObj;

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
    inputEvaluationObj = new InputEvaluation();
    inputEvaluationObj.listenWindowMessage();
    inputEvaluationObj.init();
    
}



function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#evaluation_input_warning").hide();
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    