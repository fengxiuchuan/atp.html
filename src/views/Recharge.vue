<template>
    <section>
        
        <!--充值课程列表-->
        <el-table  :data="selectedCourseList" highlight-current-row border   style="width: 100%;"  size="small">
            <el-table-column  label="订单编号" >
                <span>自动生成</span>
            </el-table-column>
            <el-table-column  label="课程名称" >
                <template scope="scope">
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
                <template scope="scope">
                    <el-select name="coachIdArr" v-model="selectedCourseList[scope.$index].coachIdArr"   filterable placeholder="请选择">
                        <el-option
                        v-for="item in scope.row.coachList"
                        :key="item.id"
                        :label="item.coachName"
                        :value="item.id" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="课时">
                <el-input type="number" placeholder="请输入课时数" >
                    <template slot="append">课时</template>
                </el-input>
            </el-table-column>
            <el-table-column label="课程费用">
                <el-input type="number" placeholder="请输入课程费用" >
                    <template slot="prepend">&yen</template>
                </el-input>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-edit-outline" @click="delRow(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
           
        </el-table>
         <div style="margin-top: 20px">
            <el-button @click="addRow()">添加一行</el-button>
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
            this.selectedCourseList.slice(index,1)
        },
        changeCoach:function(index,row){
            this.$emit('changeSelectedCourses',index,row.courseIdArr)
        },
        addRow:function(){
            this.$emit('addMemCourse')
        }
    },
    mounted(){
        
    }
}
</script>
