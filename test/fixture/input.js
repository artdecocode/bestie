/**
 * Parse the config and extract arguments from the `process.argv` array.
 * @param {Config} config The configuration for parsing, where each key is a flag and values are either strings, or objects with possible properties:
 * @param {string[]} [args] Array with arguments to parse. `process.argv` is used by default. It is assumed that user arguments start from the 3rd position.
 * @returns {Object.<string, string|string[]|boolean|number>} An object with all found values for the configuration request.
 */
export default function argufy(config = {}, args = process.argv) {
  process.stdout.write(JSON.stringify(config))
  process.stdout.write(JSON.stringify(args))
}

