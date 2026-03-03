import { Item } from "../models/Item";

export interface MenuItemDTO extends Item {
    /**
     * Optional category for grouping UI elements on the POS register screen.
     */
    category?: string;
}
