import { ServiceStatus } from '../enums/service-status.enum';

export class Service {
    public id: string;
    public title: string;
    public description: string;
    public status: ServiceStatus;
    public createdAt: Date;

    constructor(
        id: string,
        title: string,
        description: string,
        status: ServiceStatus,
        createdAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    public changeStatus(newStatus: ServiceStatus): void {

        //Estado igual, no se hace nada
        if (this.status === newStatus) {
            return;
        }

        //Completado no puede cambiar de estado
        if (this.status === ServiceStatus.COMPLETED) {
            throw new Error('Un servicio completado no puede cambiar su estado.')
        }

        //Pendiente solo puede pasar a en progreso
        if (this.status === ServiceStatus.PENDING && newStatus !== ServiceStatus.IN_PROGRESS) {
            throw new Error('Un servicio pendiente solo puede pasar a en progreso.')
        }

        //En progreso solo puede pasar a completado
        if (this.status === ServiceStatus.IN_PROGRESS && newStatus !== ServiceStatus.COMPLETED) {
            throw new Error('Un servicio en progreso solo puede pasar a completado.')
        }

        this.status = newStatus;
    }
}

