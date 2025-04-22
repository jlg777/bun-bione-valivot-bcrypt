import { IncomingMessage } from 'http'
import { StringDecoder } from 'string_decoder'

/**
 * Parses the body of an incoming HTTP request.
 *
 * This function reads the request stream, decodes the data as UTF-8,
 * and attempts to parse it as JSON.
 *
 * @param {IncomingMessage} req - The incoming HTTP request object.
 * @returns {Promise<any>} A Promise that resolves with the parsed JSON object,
 * or rejects if the body is not valid JSON.
 */
export const parserBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    const decoder = new StringDecoder('utf-8')
    let buffer = ''

    req.on('data', (chunk) => {
      buffer += decoder.write(chunk)
      //console.log(buffer)
    })

    req.on('end', () => {
      buffer += decoder.end()
      try {
        resolve(JSON.parse(buffer))
      } catch (error) {
        reject(error)
      }
    })
  })
}
