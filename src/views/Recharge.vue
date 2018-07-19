<template>
    <section>
        
        <!--充值课程列表-->
        <el-table  :data="selectedCourseList" highlight-current-row border   style="width: 100%;"  size="small">
            <el-table-column  label="课程名称" >
                <template slot-scope="scope">
                    <el-select name="courseIdArr" v-model="selectedCourseList[scope.$index].courseIdArr" filterable placeholder="请选择" @change="changeCoach(scope.$index, scope.row)">
                        <el-option
                        v-for="item in scope.row.courseList"
                        :key="item.id"
                        :label="item.courseName"
                        :value="item.id" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="课程教练"  >
                <template slot-scope="scope">
                    <el-select name="coachIdArr" v-model="selectedCourseList[scope.$index].coachIdArr" filterable placeholder="请选择" @change="coachChange(scope.$index, scope.row)" >
                        <el-option
                        v-for="item in scope.row.coachList"
                        :key="item.id"
                        :label="item.coachName"
                        :value="item.id" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="课时单价">
                <template slot-scope="scope">
                    <el-input  v-model="selectedCourseList[scope.$index].unitPrice" type="text" placeholder="请输入课时单价" @change="changePrice(scope.$index, scope.row)" >
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="课时">
                <template slot-scope="scope">
                    <el-input v-model="selectedCourseList[scope.$index].totalNumArr" type="text" placeholder="请输入课时数"  @change="changePrice(scope.$index, scope.row)" >
                    </el-input>
                </template>
            </el-table-column>
            
            <el-table-column label="总价">
                <template slot-scope="scope">
                    {{selectedCourseList[scope.$index].courseAmountArr }}
                </template>
            </el-table-column>
            <el-table-column label="优惠价格">
                <template slot-scope="scope">
                    <el-input  v-model="selectedCourseList[scope.$index].discountAmount" type="text" placeholder="请输入优惠价格" @change="changePrice(scope.$index, scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="实付">
                <template slot-scope="scope">
                     {{selectedCourseList[scope.$index].actualAmount }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-minus" @click="delRow(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
           
        </el-table>
         <div style="margin-top: 5px">
            <el-button size="small" icon="el-icon-plus" @click="addRow()">添加报名课程</el-button>
        </div>
    </section>
</template>
<script>
export default {
    data:function(){
        return {
           selectedCourseList:this.memCourselist,
           courseIdArr:[]
        }
    },
    props:['memCourselist'],
    methods:{
        //删除一行
        delRow:function(index,row){
            this.selectedCourseList.splice(index,1)
        },
        changeCoach:function(index,row){
            let curCourseList = row.courseList;
            let curCourseId = row.courseIdArr;
            let curCoachList =  this.getCoachListByCourseId(curCourseList,curCourseId);
            this.selectedCourseList[index].coachList = curCoachList;
            this.selectedCourseList[index].coachIdArr = null;
        },
        getCoachListByCourseId:function(curCourseList,curCourseId){
            let coachList = []
            curCourseList.forEach(element => {
                if(element.id == curCourseId){
                    coachList =  element.coachList;
                    
                }
            });
            return coachList;
        },
        coachChange:function(index,row){
           this.selectedCourseList[index].coachIdArr = row.coachIdArr;
        },
        addRow:function(){
            this.$emit('addMemCourse')
        },
        updateSelectdCourse:function(){
            this.$emit('refreshSelectedCourses',this.selectedCourseList)
        },
        changePrice:function(index,row){
            let unitPrice = row.unitPrice;
            let totalNumArr = row.totalNumArr;
            let discountAmount = row.discountAmount;
            if(!unitPrice || !totalNumArr){
                this.selectedCourseList[index].courseAmountArr = '';
                this.selectedCourseList[index].actualAmount =  '';
                return;
            }
            let totalPrice = unitPrice * totalNumArr;
            if(!discountAmount){
                discountAmount = 0;
            }
            this.selectedCourseList[index].courseAmountArr = totalPrice;
            this.selectedCourseList[index].actualAmount = totalPrice - discountAmount;
        }
    },
    watch:{
        selectedCourseList:{
            handler: function (val, oldVal) {
                this.updateSelectdCourse();
             },
            deep: true
        }
    }
}
</script>
