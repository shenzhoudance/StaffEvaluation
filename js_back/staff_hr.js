"use strict";

var StaffItem = function(text) {
	if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name;
        this.sex = obj.sex;
        this.birthday = obj.birthday;
        this.email = obj.email;
        this.self_evaluation = obj.self_evaluation;
        this.from = obj.from;
	} else {
	    this.name = "";
        this.sex = "";
        this.birthday = "";
        this.from = "";
	}
};
var EvaluationItem = function(text) {
	if (text) {
        var obj = JSON.parse(text);
        this.staffId = obj.staffId;
        this.company = obj.company;
        this.hrName = obj.hrName;
        this.star = obj.star;
        this.evaluation = obj.evaluation;
        this.evaTime = obj.evaTime;
        this.from = obj.from;
	} else {
        this.staffId = "";
	    this.company = "";
        this.hrName = "";
        this.star = "";
        this.evaluation = "";
        this.from = "";
	}
};

StaffItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
EvaluationItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var StaffEvaluationSys = function() {
    // 2. 定义数据结构，该行代码作用：为ApiSample创建一个属性sample_data，该属性是一个list结构，list中存储的是SampleDataItem对象
    LocalContractStorage.defineMapProperty(this, "staff_list", {
        parse: function (text) {
            return new StaffItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "staff_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "staff_list_array");

    LocalContractStorage.defineMapProperty(this, "evaluation_list", {
        parse: function (text) {
            return new EvaluationItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "evaluation_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "evaluation_list_array");


    // 3. 经过1和2步，数据结构定义完成，下面需要实现接口方法，所有的数据都存放在sample_data中
}
StaffEvaluationSys.prototype = {
    // 初始化方法，在使用ApiSample之前，务必要调用一次(而且只能调用一次)，所有的初始化逻辑都放到这里
    init: function() {
        this.staff_list_size = 0;
        this.evaluation_list_size = 0;
    },
    // 添加一个对象到list中的例子
    add_staff_to_list: function(text) {
        var addResult = {
            success : false,
            message : ""
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
        var result = this.query_staff_by_from(obj.from);
        if(result.success){
            addResult.success = false;
            addResult.message = "You have added a staff!";
            return addResult;
        }else{
            obj.name = obj.name.trim();
            obj.sex = obj.sex.trim();
            obj.birthday = obj.birthday.trim();
            if(obj.name===""|| obj.sex===""||obj.birthday==="" || obj.email === "" || obj.self_evaluation == ""){
                addResult.success = false;
                addResult.message = "empty name / sex / birthday / email / self_evaluation";
                return addResult;
            }
            if (obj.name.length > 64 || obj.sex.length > 64 || obj.birthday.length > 64){
                addResult.success = false;
                addResult.message = "name / sex / birthday exceed limit length";
                return addResult;
            }
            var staff = new StaffItem();
            staff.name = obj.name;
            staff.sex = obj.sex;
            staff.birthday = obj.birthday;
            staff.email = obj.email;
            staff.self_evaluation = obj.self_evaluation;
            staff.from = obj.from;
            var index = this.staff_list_size;
            this.staff_list_array.put(index,staff.from);
            this.staff_list.put(staff.from, staff);
            this.staff_list_size +=1;
            addResult.success = true;
            addResult.message = "You successfully added a staff!";
            return addResult;
        }
    },
    staff_list_size : function(){
        return this.staff_list_size;
    },
    // 从list中查找对象的例子
    query_staff_by_from: function(key) {
        var result = {
            success : false,
            type: "staff",
            staff : ""
        };
        key = key.trim();
        if ( key === "" ) {
            result.success = false;
            result.staff = "";
            return result;
        }
        var staff = this.staff_list.get(key);
        if(staff){
            result.success = true;
            result.staff = staff;
        }else{
            result.success = false;
            result.staff = "";
        }
        return result;
    },
    query_my_staff: function(){
        var from = Blockchain.transaction.from;
        return this.query_staff_by_from(from);
    },
    add_staff_evaluation:function(text){
        var addResult = {
            success : false,
            message : ""
        };
        var obj = text;
        obj.staffId = obj.staffId.trim();
        var result = this.query_staff_by_from( obj.staffId);
        if(result.success){
            obj.from = Blockchain.transaction.from;
            var result2 = this.query_staff_evaluation_by_key(obj.staffId+"_"+obj.from);
            if(result2.success){
                addResult.success = false;
                addResult.message = "You have already evaluated this staff!";
                return addResult;
            }else{
                obj.company = obj.company.trim();
                obj.hrName = obj.hrName.trim();
                obj.star = obj.star.trim();
                obj.evaluation = obj.evaluation.trim();
                if(obj.company===""|| obj.hrName===""||obj.star===""||obj.evaluation===""){
                    addResult.success = false;
                    addResult.message = "empty company / hrName / star / evaluation";
                    return addResult;
                }
                if (obj.company.length > 64 || obj.hrName.length > 64 || obj.star.length > 64||obj.evaluation > 200){
                    addResult.success = false;
                    addResult.message = "company / hrName / star / evaluation exceed limit length";
                    return addResult;
                }
                var evaluation = new EvaluationItem();
                evaluation.staffId = obj.staffId;
                evaluation.company = obj.company;
                evaluation.hrName = obj.hrName;
                evaluation.star = obj.star;
                evaluation.evaTime = obj.evaTime;
                evaluation.evaluation = obj.evaluation;
                evaluation.from = obj.from;
                var index = this.evaluation_list_size;
                this.evaluation_list_array.put(index,evaluation.staffId+"_"+evaluation.from);
                this.evaluation_list.put(evaluation.staffId+"_"+evaluation.from, evaluation);
                this.evaluation_list_size +=1;
                addResult.success = true;
                addResult.message = "You successfully added ths staff's evaluation!";
                return addResult;
            }
        }else{
            addResult.success = false;
            addResult.message = "Can not find the staff!";
            return addResult;
        }
    },
    evaluation_list_size : function(){
        return this.evaluation_list_size;
    },
    query_staff_evaluation_by_key: function(key) {
        var result = {
            success : false,
            type: "evaluation",
            evaluation : ""
        };
        key = key.trim();
        if ( key === "" ) {
            result.success = false;
            result.evaluation = "";
            return result;
        }
        var evaluation = this.evaluation_list.get(key);
        if(evaluation){
            result.success = true;
            result.evaluation = evaluation;
        }else{
            result.success = false;
            result.evaluation = "";
        }
        return result;
    },    
    query_the_staff_evaluation : function(staff_from){
        var result = {
            success : false,
            type: "evaluation",
            data : []
        };
        staff_from = staff_from.trim();
        if(staff_from===""){
            result.success = false;
            return result;
        }
        var number = this.evaluation_list_size;
        var evaluation;
        var key;
        for(var i=0;i<number;i++){
            key = this.evaluation_list_array.get(i);
            evaluation = this.evaluation_list.get(key);
            if(evaluation&&evaluation.staffId==staff_from){
                result.data.push(evaluation);
            }
        }
        if(result.data.length == 0){
            result.success = false;
        }else{
            result.success = true;
        }
        return result;
    },
    query_my_evaluation: function() {
        var from = Blockchain.transaction.from;
        return this.query_the_staff_evaluation(from);
    },
};

module.exports = StaffEvaluationSys;