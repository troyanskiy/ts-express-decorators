import {deepExtends, Store} from "@tsed/core";
import {HookDoneFunction, HookNextFunction, Schema} from "mongoose";
import {MONGOOSE_SCHEMA, MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {MongooseModelOptions} from "../interfaces/MongooseModelOptions";

/**
 *
 * @param target
 * @param {MongooseModelOptions} options
 */
export function schemaOptions(target: any, options?: MongooseModelOptions) {
    const store = Store.from(target);
    if (options) {
        options = deepExtends(store.get(MONGOOSE_SCHEMA_OPTIONS) || {}, options);
        store.set(MONGOOSE_SCHEMA_OPTIONS, options);
    }
    return store.get(MONGOOSE_SCHEMA_OPTIONS);
}

/**
 *
 * @param {Function} fn
 * @returns {any}
 */
export function buildPreHook(fn: Function) {
    if (fn.length === 2) {
        return function (next: HookNextFunction) {
            return fn(this, next);
        };
    }

    return function (next: HookNextFunction, done: HookDoneFunction) {
        return fn(this, next, done);
    };
}

/**
 *
 * @param target
 * @param {MongooseModelOptions} options
 */
export function applySchemaOptions(target: any, options: MongooseModelOptions) {
    const store = Store.from(target);

    options = schemaOptions(target, options);

    if (store.has(MONGOOSE_SCHEMA)) {
        const schema: Schema = store.get(MONGOOSE_SCHEMA);

        if (options.plugins) {
            if (options.plugins) {
                options.plugins.forEach((item) => schema.plugin(item.plugin, item.options));
            }
        }

        if (options.pre) {
            options.pre.forEach((item) =>
                schema.pre(item.method, !!item.parallel, buildPreHook(item.fn), item.errorCb)
            );
        }

        if (options.post) {
            options.post.forEach((item) =>
                schema.post(item.method, item.fn as any)
            );
        }
    }
}
