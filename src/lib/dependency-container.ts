
import { DependencyContainer as DependencyContainerClass } from './dependency-container-class';

type ServiceIdentifier<T = any> = string | symbol;

type Provider<T> = () => T;
interface Registration<T> {
  provider: Provider<T>;
  lifecycle: 'singleton' | 'transient';
  instance?: T; // For singletons
}

class DependencyContainer extends DependencyContainerClass {}

export const container = new DependencyContainer();
