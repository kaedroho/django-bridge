/* eslint-disable dot-notation, no-param-reassign */

/*
MIT License

Copyright (c) 2021 Wagtail

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * Based on 'telepath-unpack' version 0.4 with TypeScript annotations added.
 * https://github.com/wagtail/telepath-unpack
 */

interface PackedValuesById {
  [id: string]: any;
}

interface ValuesById {
  [id: string]: any;
}

interface ConstructorRegistry {
  [name: string]: new (...args: any[]) => any;
}

export default class Telepath {
  constructors: ConstructorRegistry;

  constructor() {
    this.constructors = {};
  }

  register(name: string, constructor: new (...args: any[]) => any): void {
    this.constructors[name] = constructor;
  }

  unpack(objData: any): any {
    const packedValuesById: PackedValuesById = {};
    this.scanForIds(objData, packedValuesById);
    const valuesById: ValuesById = {};
    return this.unpackWithRefs(objData, packedValuesById, valuesById);
  }

  scanForIds(objData: any, packedValuesById: PackedValuesById): void {
    /* descend into objData, indexing any objects with an _id in packedValuesById */

    if (objData === null || typeof objData !== "object") {
      /* primitive value - nothing to scan */
      return;
    }

    if (Array.isArray(objData)) {
      /* scan recursively */
      objData.forEach((item: any) => this.scanForIds(item, packedValuesById));
      return;
    }

    /* objData is an object / dict - check for reserved key names */
    let hasReservedKeyNames = false;

    if ("_id" in objData) {
      hasReservedKeyNames = true;
      /* index object in packedValuesById */
      packedValuesById[objData["_id"]] = objData;
    }

    if ("_type" in objData || "_val" in objData || "_ref" in objData) {
      hasReservedKeyNames = true;
    }

    if ("_list" in objData) {
      hasReservedKeyNames = true;
      /* scan list items recursively */
      objData["_list"].forEach((item: any) =>
        this.scanForIds(item, packedValuesById)
      );
    }

    if ("_args" in objData) {
      hasReservedKeyNames = true;
      /* scan arguments recursively */
      objData["_args"].forEach((item: any) =>
        this.scanForIds(item, packedValuesById)
      );
    }

    if ("_dict" in objData) {
      hasReservedKeyNames = true;
      /* scan dict items recursively */
      // eslint-disable-next-line no-unused-vars
      for (const [key, val] of Object.entries(objData["_dict"])) {
        this.scanForIds(val, packedValuesById);
      }
    }

    if (!hasReservedKeyNames) {
      /* scan as a plain dict */
      // eslint-disable-next-line no-unused-vars
      for (const [key, val] of Object.entries(objData)) {
        this.scanForIds(val, packedValuesById);
      }
    }
  }

  unpackWithRefs(
    objData: any,
    packedValuesById: PackedValuesById,
    valuesById: ValuesById
  ): any {
    if (objData === null || typeof objData !== "object") {
      /* primitive value - return unchanged */
      return objData;
    }

    if (Array.isArray(objData)) {
      /* unpack recursively */
      return objData.map((item: any) =>
        this.unpackWithRefs(item, packedValuesById, valuesById)
      );
    }

    /* objData is an object / dict - check for reserved key names */
    let result: any;

    if ("_ref" in objData) {
      if (objData["_ref"] in valuesById) {
        /* use previously unpacked instance */
        result = valuesById[objData["_ref"]];
      } else {
        /* look up packed object and unpack it; this will populate valuesById as a side effect */
        result = this.unpackWithRefs(
          packedValuesById[objData["_ref"]],
          packedValuesById,
          valuesById
        );
      }
    } else if ("_val" in objData) {
      result = objData["_val"];
    } else if ("_list" in objData) {
      result = objData["_list"].map((item: any) =>
        this.unpackWithRefs(item, packedValuesById, valuesById)
      );
    } else if ("_dict" in objData) {
      result = {} as { [key: string]: any };
      for (const [key, val] of Object.entries(objData["_dict"])) {
        result[key] = this.unpackWithRefs(val, packedValuesById, valuesById);
      }
    } else if ("_type" in objData) {
      /* handle as a custom type */
      const constructorId = objData["_type"];
      const constructor = this.constructors[constructorId];
      if (typeof constructor !== "function") {
        throw new Error(
          `telepath encountered unknown object type ${constructorId}`
        );
      }
      /* unpack arguments recursively */
      const args = objData["_args"].map((arg: any) =>
        this.unpackWithRefs(arg, packedValuesById, valuesById)
      );
      result = new constructor(...args);
    } else if ("_id" in objData) {
      throw new Error(
        "telepath encountered object with _id but no type specified"
      );
    } else {
      /* no reserved key names found, so unpack objData as a plain dict and return */
      result = {} as { [key: string]: any };
      for (const [key, val] of Object.entries(objData)) {
        result[key] = this.unpackWithRefs(val, packedValuesById, valuesById);
      }
      return result;
    }

    if ("_id" in objData) {
      valuesById[objData["_id"]] = result;
    }

    return result;
  }
}
