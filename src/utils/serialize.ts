import { Serializable } from "./deserialize";


const serialize = (data: Serializable): Record<string, string> =>
  Object.entries(data).reduce((acc, [key, value]) => {
    if (!value) return acc;

    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: value.map(v => JSON.stringify(v))
      };
    }

    if (typeof value === 'object') {
      return {
        ...acc,
        [key]: JSON.stringify(value)
      };
    }

    return {
      ...acc,
      [key]: value
    };
  }, {});

export default serialize;