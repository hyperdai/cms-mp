
const host = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5858/weapp/'
  : 'https://cms.hyperdai.com/weapp/'

const config = {
  host,
  loginUrl: `${host}login`,
  upUrl: `${host}upload`
}

module.exports = config
