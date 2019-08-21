/** 
* Name: <Pang Chong Xian>
* Reg . No . : <1603771>
*/
exports.getValue = (array, key) => {
    return array.filter((o) => o.key === key)[0].value
  }

  exports.getKey = (array, value) => {
    return array.filter((o) => o.value === value)[0].key
  }
  
  exports.languages = [
    {key: '01', value: 'English'},
    {key: '02', value: 'Malay'},
    {key: '03', value: 'Mandarin'},
    {key: '04', value: 'Contonese'},
    {key: '05', value: 'Japan'},
    {key: '06', value: 'Korea'},
  ];