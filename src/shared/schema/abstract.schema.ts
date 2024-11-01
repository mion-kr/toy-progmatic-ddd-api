export type AbstractOptionalProps = {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
};

export abstract class AbstractSchema {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;

  constructor(props: Partial<AbstractSchema>) {
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy;
    this.deletedAt = props.deletedAt ?? undefined;
    this.deletedBy = props.deletedBy ?? undefined;
  }

  protected setCreatedInfo(createdBy: string) {
    this.createdAt = new Date();
    this.createdBy = createdBy;

    if (!this.updatedAt) {
      this.setUpdatedInfo(createdBy);
    }
  }

  protected setUpdatedInfo(updatedBy: string) {
    this.updatedAt = new Date();
    this.updatedBy = updatedBy;
  }

  protected setDeletedInfo(deletedBy: string) {
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
  }
}
