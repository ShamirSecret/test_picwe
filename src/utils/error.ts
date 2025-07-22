const  errorParse = (v: any) => {
  const val = v.toString();
  if (val.includes('User rejected the request')) {
    return 'User rejected the request'
  }
  if (val.includes('Account not found')) {
    return 'Account not found'
  }
  if (val.includes('is already initialized as a coin')) {
    return 'CoinType is already initialized as a coin';
  }
  if (val.includes('Not enough coins to complete transaction')) {
    return 'Not enough coins to complete transaction'
  }
  if (val.includes('Insufficient balance')) {
    return 'Insufficient balance'
  }
  if (val.includes('Transaction not found')) {
    return 'The network connection is unstable. The transaction may have already been submitted to the chain. Please do not resubmit.'
  }
  return val
}

export default errorParse;