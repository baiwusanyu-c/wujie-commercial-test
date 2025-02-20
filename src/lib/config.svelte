<script lang="ts">
  import { KInput, KForm, KFormItem, KButton, KSelect } from '@ikun-ui/core';
  import { ENV_CONFIG } from "../utils/env";
  const cache = localStorage.getItem('wujie-test-config')

  const initValue =  cache ? JSON.parse(cache)  : {
    env: '',
    groupId: '267356',
    token: ''
  };
  let KFormInst: KForm | undefined = undefined;

  const handleValidate = () => {
    if (KFormInst) {
      KFormInst.validateForm((data, isValid) => {
        if (isValid) {
          localStorage.setItem('wujie-test-config', JSON.stringify(data));
          window.location.reload();
        }
      });
    }
  };

</script>

<div class="fcc">
    <KForm {initValue} bind:this={KFormInst} >
        <KFormItem field="env" label="系统环境:">
            <KSelect clearable
                     key="value"
                     dataList={ENV_CONFIG}
            ></KSelect>
        </KFormItem>
        <KFormItem field="groupId" label="集团ID:">
            <KInput placeholder="请输入集团ID" disabled></KInput>
        </KFormItem>
        <KFormItem field="token" label="平台token:">
            <KInput placeholder="请输入平台token"></KInput>
        </KFormItem>
        <KFormItem>
            <KButton on:click={handleValidate}>确认</KButton>
        </KFormItem>
    </KForm>
</div>
