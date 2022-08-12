import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class AddonModule {
  AddOnId: number;
  AddonGroupId: number;
  DeliveryPrice: number;
  Description: string;
  Id: number;
  Price: number;
  ProductId: number;
  TakeawayPrice: number;
  // addnId:number;
  del: number;
  // valid:number;
  constructor() {
    this.del = 0;
  }
}

export class AddonGroupModule {
  AddonGroupId: number;
  Description: string;
  Id: number;
  // addnGId:number;
  del: number;
  constructor() {
    this.del = 0;
    this.AddonGroupId = 0;
  }
}
export class VariantGroupModule {
  Description: string;
  Id: number;
  VariantGroupId: number;
  del: number;
  // varGId:number;
  constructor() {
    this.del = 0;
    this.VariantGroupId = 0;
  }
}

export class VariantModule {
  DeliveryPrice: number;
  Description: string;
  Id: number;
  Price: number;
  TakeawayPrice: number;
  VariantGroupId: number;
  VariantId: number;
  del: number;
  // varId:number;
  // valid:number;
  constructor() {
    this.del = 0;
  }
}
export class OptionGroupModule {
  Description: string;
  Id: number;
  OptionGroupId: number;
  del: number;
  // varGId:number;
  constructor() {
    this.del = 0;
    this.OptionGroupId = 0;
  }
}

export class OptionModule {
  DeliveryPrice: number;
  Description: string;
  Id: number;
  Price: number;
  TakeawayPrice: number;
  OptionGroupId: number;
  OptionId: number;
  del: number;
  // varId:number;
  // valid:number;
  constructor() {
    this.del = 0;
  }
}

export class ProductModule {
  Action: string
  CategoryId: number;
  KOTGroupId: number;
  DeliveryPrice: number;
  Id: number;
  IsAvailable: number;
  IsDeliveryService: number;
  IsDineInService: number;
  IsTakeAwayService: number;
  Price: number;
  Name: String;
  Description: String;
  TakeawayPrice: number;
  TaxGroupId: number;
  CompanyId: number;
  ProductTypeId: number = 1;
  UnitId: String;
  AddOnGroup: Array<AddonGroupModule>;
  Addon: Array<AddonModule>;
  Variant: Array<VariantModule>;
  VariantGroup: Array<VariantGroupModule>;
  OptionGroup: Array<OptionGroupModule>;
  Option: Array<OptionModule>;
  ProductOptionGroups: Array<any>;
  ProductOptions: Array<any>;
  ImgUrl: string;
  ProductCode: string;
  Barcode: string;
  Recomended: boolean;
  SortOrder: number;
  UPPrice: number;
  minquantity: number;
  minblock: number;
  IsSaleProdGroup: boolean;
  // Name: string;
  isactive: boolean;
  constructor(data: any, compId) {
    console.log(data)
    var obj = data.product[0];
    if (obj != undefined) {
      this.CategoryId = obj.categoryId;
      this.KOTGroupId = obj.kotGroupId;
      if (this.KOTGroupId == null) {
        this.KOTGroupId = 0;
      }
      this.Action = '',
        this.isactive = obj.isactive;
      this.DeliveryPrice = obj.deliveryPrice;
      this.Id = obj.id;
      this.IsAvailable = obj.isAvailable;
      this.IsDeliveryService = obj.isDeliveryService;
      this.IsDineInService = obj.isDineInService;
      this.IsTakeAwayService = obj.isTakeAwayService;
      this.Price = obj.price;
      this.Description = obj.description;
      this.Name = obj.product;
      this.TakeawayPrice = obj.takeawayPrice;
      this.TaxGroupId = obj.taxGroupId;
      this.UnitId = obj.unitId;
      this.CompanyId = obj.companyId;
      this.ProductTypeId = obj.productTypeId;
      this.ProductOptionGroups = [];
      this.ImgUrl = obj.ImgUrl;
      this.ProductCode = obj.productCode;
      this.Barcode = obj.barCode
      this.Recomended = obj.recomended;
      this.SortOrder = obj.sortOrder;
      this.UPPrice = obj.upPrice;
      this.minquantity = obj.minquantity;
      this.minblock = obj.minblock;
      this.IsSaleProdGroup = obj.IsSaleProdGroup;
    }
    else {
      this.CategoryId = 0;
      // this.KOTGroupId = 0;
      this.DeliveryPrice = 0;
      this.Id = 0;
      this.IsAvailable = 1;
      this.IsDeliveryService = 1;
      this.IsDineInService = 1;
      this.IsTakeAwayService = 1;
      this.Price = 0;
      this.Description = "";
      this.Name = "";
      this.TakeawayPrice = 0;
      this.TaxGroupId = data.taxGroup[0].Id;
      this.UnitId = data.units[0].Id;
      this.KOTGroupId = 0;
      this.CompanyId = compId;
      this.ProductTypeId = data.productType[0].Id;
      this.ProductOptionGroups = [];
      this.ProductOptions = [];
      this.OptionGroup = [];
      this.ImgUrl = '';
      this.ProductCode = '';
      this.Barcode = '';
      this.Recomended = false;
      this.SortOrder = -1;
      this.UPPrice = 0;
      this.Name = '';
      this.minquantity = 0;
      this.minblock = 0;
      this.IsSaleProdGroup = false;
    }
  }
}

export class PredefinedQuantityModule {
  Id: number
  QuantityText: string
  Quantity: number
  FreeQuantity: number
  TotalQuantity: number
  ProductId: number
  CompanyId: number
  CakeQuantityId: number
  isdeleted: boolean
  edit: boolean
  Price: number
  constructor(obj) {
    this.Id = 0
    this.QuantityText = ''
    this.Quantity = null
    this.FreeQuantity = null
    this.TotalQuantity = 0
    this.ProductId = obj.productid
    this.CompanyId = obj.companyid
    this.isdeleted = false
    this.edit = false
    this.Price = 0
  }
}
