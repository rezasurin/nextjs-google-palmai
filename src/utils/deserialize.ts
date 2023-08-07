
export type Serializable = Record<string, any>;

const deserialize = (data: Serializable): Serializable =>
  Object.entries(data).reduce((acc, [key, value]) => {
    try {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return {
          ...acc,
          [key]: deserialize(value)
        };
      }

      return {
        ...acc,
        [key]: JSON.parse(value)
      };
    } catch {
      return {
        ...acc,
        [key]: value
      };
    }
  }, {});

export default deserialize;