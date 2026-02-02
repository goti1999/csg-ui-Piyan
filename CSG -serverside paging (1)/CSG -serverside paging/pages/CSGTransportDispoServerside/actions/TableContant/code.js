const pageSize = 500;
const firstPageData = await actions.Table2.trigger({ page: 1, pageSize: pageSize });
const TotalCount = firstPageData[0].TotalCount;
const pages = Math.ceil(TotalCount / pageSize);
const tempResult = [...firstPageData];
for (let page = 2; page <= pages; page++) {
  const pageData = await actions.Table2.trigger({ page: page, pageSize: pageSize });
  tempResult.push(...pageData);
  //state.TableContent.push(...tempResult);
}
// state.resetValue("TableContent");
// state.setValue("TableContent", tempResult);
state.setValue('TotalCount', TotalCount);
state.setValue('TableContent', tempResult);
console.log(tempResult.length);
return tempResult;