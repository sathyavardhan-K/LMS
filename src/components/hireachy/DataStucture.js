function hierarchy(data) {
  const hierarchy = {
    name: "Total Receivables",
    attributes: { total: 0 },
    children: [],
  };
  const companies = {};
  data.forEach((item) => {
    const company = item.Company;
    if (!companies[company]) {
      companies[company] = {
        name: company,
        attributes: { total: 0 },
        children: [],
      };
    }
    const customerType = item["Customer Type"];
    const companyNode = companies[company];
    let customerTypeNode = companyNode.children.find(
      (child) => child.name === customerType
    );
    if (!customerTypeNode) {
      customerTypeNode = {
        name: customerType,
        attributes: { total: 0 },
        children: [],
      };
      companyNode.children.push(customerTypeNode);
    }
    const interval = item.Intervals;
    let intervalNode = customerTypeNode.children.find(
      (child) => child.name === interval
    );
    if (!intervalNode) {
      intervalNode = { name: interval, attributes: { total: 0 } };
      customerTypeNode.children.push(intervalNode);
    }
    intervalNode.attributes.total += item.Receivable;
    customerTypeNode.attributes.total += item.Receivable;
    companyNode.attributes.total += item.Receivable;
    hierarchy.attributes.total += item.Receivable;
  });
  hierarchy.children = Object.values(companies);
  return hierarchy;
}
export default hierarchy;
