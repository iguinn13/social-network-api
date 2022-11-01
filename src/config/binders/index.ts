import { Container } from 'inversify';

export abstract class _Binder {
    public abstract load(container?: Container): Promise<boolean>;
}
