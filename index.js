

'use strict';

var dappAddress = "n1zdqWBYt1zsCVobayL1SJEKpkuGwWo2voV";
var StaffEvaluationShow = function() {

}
StaffEvaluationShow.prototype = {

    init: function() {
        var self = this;
        $("#commit_search").click(function() {
            var key_input = $("#search_key_input").val();
            if (key_input == "") {
                return;
            }
            self.doSearchByKey(key_input);
        });
        $("#search_myself").click(function() {
            self.doSearchMySelf();
        });
    },

    doSearchByKey: function(key) {
        // 查询这个人信息
        var req_args = [];
        req_args.push(key);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_staff_by_from",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
        // 查询评论信息
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_the_staff_evaluation",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },
    doSearchMySelf: function() {
        // 查询我的信息
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_my_staff",
                    "args" : ""
                }
            },
            "method": "neb_call"
        }, "*");
        // 查询我的评论
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_my_evaluation",
                    "args" : ""
                }
            },
            "method": "neb_call"
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
                    if (obj.type == "staff") {
                        self.parseStaffInfo(obj);
                    } else if (obj.type == "evaluation") {
                        self.parseEvaluationInfo(obj);
                    } else {
                        console.log("no need attation");
                    }
                    console.log(obj);
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parseStaffInfo: function(staff_info) {
        $("#section_staff_info").show();
        // 设置内容
        if (staff_info.staff != "") {
            // 显示内容
            if("女" == staff_info.staff.sex){
                $("#staff_man").hide();
               $("#staff_woman").show();
            }else{
                $("#staff_woman").hide();
                $("#staff_man").show();
            }
            $("#staff_name").text(staff_info.staff.name);
            $("#staff_sex").text(staff_info.staff.sex);
            $("#staff_birthday").text(staff_info.staff.birthday);
            $("#staff_email").text(staff_info.staff.email);
            $("#staff_own_evaluation").text(staff_info.staff.self_evaluation);
            $("#staff_warning").hide();
            $("#staff_info").show();
        } else {
            // 显示没有查询到结果
            $("#staff_info").hide();
            $("#staff_warning").show();
        }
    },
    parseEvaluationInfo: function(evaluation_info) {
        $("#section_staff_evaluation").show();
        if (evaluation_info.data.length == 0) {
            // 显示没有评论
            $("#evaluation_list").hide();
            $("#evaluation_warning").show();
            
        } else {
            $("#evaluation_warning").hide();
            $("#evaluation_list").empty();
            $("#evaluation_list").show();
            // 显示内容
            var evaluation_list = template(document.getElementById('evaluation_list_t').innerHTML);
            var evaluation_list_html = evaluation_list({list: evaluation_info.data});
            console.log(evaluation_list_html);
            $("#evaluation_list").append(evaluation_list_html);
        }
    },
}

var staffEvalutionObj;

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
    staffEvalutionObj = new StaffEvaluationShow();
    staffEvalutionObj.listenWindowMessage();
    staffEvalutionObj.init();
    
}



function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#section_staff_info").hide();
        $("#section_staff_evaluation").hide();
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    