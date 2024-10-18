import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import List "mo:base/List";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor ShoppingList {
  type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  stable var nextId: Nat = 0;
  let items = HashMap.HashMap<Nat, Item>(0, Nat.equal, Nat.hash);

  public func addItem(text: Text) : async Nat {
    let id = nextId;
    items.put(id, { id = id; text = text; completed = false });
    nextId += 1;
    id
  };

  public query func getItems() : async [Item] {
    Iter.toArray(items.vals())
  };

  public func updateItem(id: Nat, completed: Bool) : async Bool {
    switch (items.get(id)) {
      case (null) { false };
      case (?item) {
        items.put(id, { id = id; text = item.text; completed = completed });
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    switch (items.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  system func preupgrade() {
    // No need to implement as we're using a stable variable for nextId
    // and items is already using a HashMap
  };

  system func postupgrade() {
    // No need to implement as we're using a stable variable for nextId
    // and items is already using a HashMap
  };
}
