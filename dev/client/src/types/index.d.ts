declare module "*.vue";
/**
 * Reactive Media Query.
 *
 * @see /useMediaQuery
 * @param query
 * @param options
 */
export declare function useMediaQuery(query: string, options?: ConfigurableWindow): Ref<boolean>;
