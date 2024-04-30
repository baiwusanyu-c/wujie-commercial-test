<template>
  <div>
    <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef" />
    <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

/* 注意：formJson是指表单设计器导出的json，此处演示的formJson只是一个空白表单json！！ */
const formJson = reactive({
  widgetList: [
    {
      type: 'grid',
      category: 'container',
      icon: 'grid',
      cols: [
        {
          type: 'grid-col',
          category: 'container',
          icon: 'grid-col',
          internal: true,
          widgetList: [
            {
              type: 'static-text',
              icon: 'static-text',
              formItemFlag: false,
              options: {
                name: 'static-text20799',
                columnWidth: '200px',
                hidden: false,
                textContent: '人员登记表',
                customClass: [],
                onCreated: '',
                onMounted: '',
                label: 'static-text',
              },
              displayName: '静态文字',
              id: 'static-text20799',
            },
          ],
          options: {
            name: 'gridCol96077',
            hidden: false,
            span: 12,
            customClass: [],
          },
          id: 'grid-col-96077',
        },
      ],
      options: {
        name: 'grid64343',
        hidden: false,
        gutter: 12,
        customClass: [],
      },
      displayName: '栅格',
      id: 'grid64343',
    },
    {
      type: 'grid',
      category: 'container',
      icon: 'grid',
      cols: [
        {
          type: 'grid-col',
          category: 'container',
          icon: 'grid-col',
          internal: true,
          widgetList: [
            {
              type: 'input',
              icon: 'text-field',
              formItemFlag: true,
              options: {
                name: 'input97458',
                label: '姓名',
                labelAlign: '',
                type: 'text',
                defaultValue: '',
                placeholder: '',
                columnWidth: '200px',
                size: '',
                labelWidth: null,
                labelHidden: false,
                readonly: false,
                disabled: false,
                hidden: false,
                clearable: true,
                showPassword: false,
                required: true,
                validation: '',
                validationHint: '',
                customClass: [],
                labelIconClass: null,
                labelIconPosition: 'rear',
                labelTooltip: null,
                minLength: null,
                maxLength: null,
                showWordLimit: false,
                prefixIcon: '',
                suffixIcon: '',
                appendButton: false,
                buttonDisabled: false,
                buttonIcon: 'el-icon-search',
                onCreated: '',
                onMounted: '',
                onChange: '',
                onFocus: '',
                onBlur: '',
                onValidate: '',
              },
              displayName: '单行输入',
              id: 'input97458',
            },
          ],
          options: {
            name: 'gridCol66750',
            hidden: false,
            span: 12,
          },
          id: 'grid-col-66750',
        },
        {
          type: 'grid-col',
          category: 'container',
          icon: 'grid-col',
          internal: true,
          widgetList: [
            {
              type: 'radio',
              icon: 'radio-field',
              formItemFlag: true,
              options: {
                name: 'radio61394',
                label: '性别',
                labelAlign: '',
                defaultValue: 3,
                columnWidth: '200px',
                size: '',
                displayStyle: 'inline',
                labelWidth: null,
                labelHidden: false,
                disabled: false,
                hidden: false,
                optionItems: [
                  {
                    label: '女士',
                    value: 1,
                  },
                  {
                    label: '先生',
                    value: 2,
                  },
                  {
                    label: '无可奉告',
                    value: 3,
                  },
                ],
                required: false,
                validation: '',
                validationHint: '',
                customClass: [],
                labelIconClass: null,
                labelIconPosition: 'rear',
                labelTooltip: null,
                onCreated: '',
                onMounted: '',
                onChange: '',
                onValidate: '',
              },
              displayName: '单选项',
              id: 'radio61394',
            },
          ],
          options: {
            name: 'gridCol16505',
            hidden: false,
            span: 12,
          },
          id: 'grid-col-16505',
        },
      ],
      options: {
        name: 'grid88004',
        hidden: false,
        gutter: 12,
        customClass: [],
      },
      displayName: '栅格',
      id: 'grid88004',
    },
  ],
  formConfig: {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: '',
    functions: '',
    layoutType: 'PC',
    jsonVersion: 3,
    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: '',
    onFormValidate: '',
  },
})
const formData = reactive({})
const optionData = reactive({})
const vFormRef = ref(null)

const submitForm = () => {
  vFormRef.value
    .getFormData()
    .then((formData) => {
      // Form Validation OK
      alert(JSON.stringify(formData))
    })
    .catch((error) => {
      // Form Validation failed
      ElMessage.error(error)
    })
}
</script>
