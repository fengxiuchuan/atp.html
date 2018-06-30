// 重置表单的方法
export function resetForm (formName) {
  if (typeof formName !== 'undefined') {
    this.$refs[formName].resetFields()
  }
}
