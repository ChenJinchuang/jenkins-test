class Option {
  generateProxyOptions(proxyInfo) {
    const proxyOptions = []
    for (let i = 0; i < proxyInfo.length; i++) {
      const compItem = {
        value: proxyInfo[i].code,
        label: proxyInfo[i].name,
        children: [],
      }
      for (let j = 0; j < proxyInfo[i].branch.length; j++) {
        const branchItem = {
          value: proxyInfo[i].branch[j].code,
          label: proxyInfo[i].branch[j].name,
          children: [],
        }
        if (proxyInfo[i].branch[j].member) {
          const { member } = proxyInfo[i].branch[j]
          for (let k = 0; k < member.length; k++) {
            const { amount } = member[k]

            for (let l = 0; l < amount; l++) {
              const memberItem = {
                value: 10000 + l,
                label: 10000 + l,
              }
              branchItem.children.push(memberItem)
            }
          }
        }
        compItem.children.push(branchItem)
      }
      proxyOptions.push(compItem)
    }
    return proxyOptions
  }
}

export default new Option()
